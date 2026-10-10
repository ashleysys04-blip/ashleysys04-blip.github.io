import test from 'node:test';
import assert from 'node:assert/strict';
import {rich, safeUrl, postMetadata, renderBlocks, loadPosts} from '../scripts/notion.mjs';

test('Notion text is escaped and unsafe links are rejected', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '#');
  const html = rich([{plain_text:'<script>alert(1)</script>', href:'javascript:alert(1)'}]);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('href="#"'));
});
test('Post paths cannot traverse outside the writing directory', () => {
  const page = {id:'abc', created_time:'2026-10-10T00:00:00Z', properties:{Name:{title:[{plain_text:'Test'}]}, Slug:{rich_text:[{plain_text:'../../secrets'}]}}};
  assert.throws(() => postMetadata(page), /Slug/);
});
test('Lists are grouped and unsupported content stops publication', async () => {
  const html = await renderBlocks([1,2].map(n => ({type:'numbered_list_item',numbered_list_item:{rich_text:[{plain_text:String(n)}]}})), 'unused');
  assert.equal(html, '<ol><li>1</li><li>2</li></ol>');
  await assert.rejects(() => renderBlocks([{type:'video',video:{}}],'unused'), /Unsupported/);
});
test('Sync paginates, filters drafts and uses local stable post paths', async () => {
  const originalFetch = global.fetch;
  const keys = ['NOTION_TOKEN','NOTION_DATABASE_ID','NOTION_DATA_SOURCE_ID'];
  const saved = Object.fromEntries(keys.map(k => [k,process.env[k]]));
  process.env.NOTION_TOKEN = 'test-only';
  process.env.NOTION_DATA_SOURCE_ID = 'source';
  delete process.env.NOTION_DATABASE_ID;
  let queries = 0;
  global.fetch = async (url, options) => {
    if (url.endsWith('/data_sources/source')) return Response.json({properties:{Name:{type:'title'},Published:{type:'checkbox'}}});
    if (url.endsWith('/query')) {
      const body = JSON.parse(options.body);
      assert.equal(body.filter.checkbox.equals, true);
      queries++;
      if (queries === 1) return Response.json({results:[{id:'draft',properties:{Published:{checkbox:false}}}],has_more:true,next_cursor:'cursor-2'});
      assert.equal(body.start_cursor, 'cursor-2');
      return Response.json({results:[{id:'aabb',created_time:'2026-10-10T00:00:00Z',properties:{Name:{title:[{plain_text:'Public'}]},Published:{checkbox:true}}}],has_more:false});
    }
    assert.ok(url.includes('/blocks/aabb/children'));
    return Response.json({results:[{type:'paragraph',paragraph:{rich_text:[{plain_text:'Public content'}]}}],has_more:false});
  };
  try {
    const posts = await loadPosts('unused');
    assert.equal(posts.length,1);
    assert.equal(posts[0].slug,'aabb');
    assert.equal(posts[0].html,'<p>Public content</p>');
    assert.equal(queries,2);
    delete process.env.NOTION_TOKEN;
    await assert.rejects(() => loadPosts('unused'), /Set NOTION_TOKEN/);
  } finally {
    global.fetch = originalFetch;
    for(const k of keys) {if(saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k];}
  }
});
