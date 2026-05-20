import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CDN_BASE, SPACES_BASE, buildURL, getHeaders, toQuery, type SbContext } from "./utils.js";

export function storyblok(server: McpServer, ctx: SbContext) {
  const { api, managementBase, managementToken, publicToken, spaceId } = ctx;
  server.tool('ping', {}, async () => {
    try {
      await api.get(`${CDN_BASE}/spaces/${spaceId}?token=${publicToken}`);
      return { content: [{ type: 'text', text: 'Server is running and Storyblok API is reachable.' }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_stories', {
    page: z.number().optional(),
    per_page: z.number().optional(),
    starts_with: z.string().optional(),
    by_slugs: z.string().optional(),
    excluding_slugs: z.string().optional(),
    sort_by: z.string().optional(),
    search_term: z.string().optional()
  }, async (params) => {
    try {
      const q = toQuery({ ...params, token: publicToken });
      const res = await api.get(`${CDN_BASE}/stories${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story', { id: z.string() }, async ({ id }) => {
    try {
      const q = toQuery({ token: publicToken });
      const res = await api.get(`${CDN_BASE}/stories/${id}${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_story', {
    name: z.string(),
    slug: z.string(),
    content: z.record(z.unknown()),
    parent_id: z.number().optional(),
    group_id: z.string().optional(),
    alternates: z.array(z.unknown()).optional(),
    is_folder: z.boolean().optional(),
    is_startpage: z.boolean().optional(),
    tag_list: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    sort_by_date: z.string().optional(),
    default_root: z.string().optional(),
    disble_fe_editor: z.boolean().optional(),
    meta_data: z.unknown().optional(),
    pinned: z.boolean().optional(),
    position: z.number().optional(),
    path: z.string().optional(),
    publish_at: z.string().optional(),
    expire_at: z.string().optional(),
    is_scheduled: z.boolean().optional(),
    scheduled_dates: z.string().optional(),
    favourite_for_user_ids: z.array(z.number()).optional()
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'stories'), { story: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_story', {
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
    content: z.record(z.unknown()).optional(),
    parent_id: z.number().optional(),
    group_id: z.string().optional(),
    alternates: z.array(z.unknown()).optional(),
    is_folder: z.boolean().optional(),
    is_startpage: z.boolean().optional(),
    tag_list: z.array(z.string()).optional(),
    published: z.boolean().optional(),
    sort_by_date: z.string().optional(),
    default_root: z.string().optional(),
    disble_fe_editor: z.boolean().optional(),
    meta_data: z.unknown().optional(),
    pinned: z.boolean().optional(),
    position: z.number().optional(),
    path: z.string().optional(),
    publish_at: z.string().optional(),
    expire_at: z.string().optional(),
    is_scheduled: z.boolean().optional(),
    scheduled_dates: z.string().optional(),
    favourite_for_user_ids: z.array(z.number()).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `stories/${id}`), { story: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_story', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `stories/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Story ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('publish_story', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `stories/${id}/publish`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('unpublish_story', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `stories/${id}/unpublish`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story_versions', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `stories/${id}/versions`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('restore_story', { id: z.string(), version_id: z.string() }, async ({ id, version_id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `stories/${id}/restore/${version_id}`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('import_story', {
    id: z.string(),
    story: z.record(z.unknown()),
    lang_code: z.string().optional(),
    import_lang: z.boolean().optional()
  }, async ({ id, story, lang_code, import_lang }) => {
    try {
      const params = [];
      if (lang_code) params.push(`lang_code=${encodeURIComponent(lang_code)}`);
      if (import_lang !== undefined) params.push(`import_lang=${import_lang}`);
      const query = params.length ? `?${params.join('&')}` : '';
      const res = await api.put(
        buildURL(managementBase, `stories/${id}/import${query}`),
        { story },
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_tags', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'tags'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_tag', { name: z.string() }, async ({ name }) => {
    try {
      const res = await api.post(buildURL(managementBase, 'tags'), { name }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_tag_and_add_to_story', { name: z.string(), story_id: z.string() }, async ({ name, story_id }) => {
    try {
      const res = await api.post(buildURL(managementBase, 'tags'), { name, story_id }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_tag', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `tags/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Tag ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_releases', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(buildURL(managementBase, `releases${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_release', { 
    name: z.string(), 
    publish_at: z.string().optional(),
    branches_to_deploy: z.array(z.number()).optional(),
    timezone: z.string().optional(),
    users_to_notify_ids: z.array(z.number()).optional()
  }, async ({ name, publish_at, branches_to_deploy, timezone, users_to_notify_ids }) => {
    try {
      const body: any = { name };
      if (publish_at) body.release_at = publish_at; // Changed to release_at as per API docs
      if (branches_to_deploy) body.branches_to_deploy = branches_to_deploy;
      if (timezone) body.timezone = timezone;
      if (users_to_notify_ids) body.users_to_notify_ids = users_to_notify_ids;
      const res = await api.post(buildURL(managementBase, 'releases'), { release: body }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('add_story_to_release', { release_id: z.string(), story_id: z.string() }, async ({ release_id, story_id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `releases/${release_id}/stories`), { story_id }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('publish_release', { release_id: z.string() }, async ({ release_id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `releases/${release_id}/publish`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_release', { 
    release_id: z.string(),
    name: z.string().optional(),
    release_at: z.string().optional(),
    branches_to_deploy: z.array(z.number()).optional(),
    timezone: z.string().optional(),
    users_to_notify_ids: z.array(z.number()).optional(),
    do_release: z.boolean().optional()
  }, async ({ release_id, name, release_at, branches_to_deploy, timezone, users_to_notify_ids, do_release }) => {
    try {
      const releaseData: any = {};
      if (name) releaseData.name = name;
      if (release_at) releaseData.release_at = release_at;
      if (branches_to_deploy) releaseData.branches_to_deploy = branches_to_deploy;
      if (timezone) releaseData.timezone = timezone;
      if (users_to_notify_ids) releaseData.users_to_notify_ids = users_to_notify_ids;
      
      const requestData: any = { 
        release: releaseData 
      };
      
      if (do_release !== undefined) requestData.do_release = do_release;
      
      const res = await api.put(
        buildURL(managementBase, `releases/${release_id}`), 
        requestData, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_release', { release_id: z.string() }, async ({ release_id }) => {
    try {
      await api.delete(buildURL(managementBase, `releases/${release_id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Release ${release_id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_assets', {
    page: z.number().optional(),
    per_page: z.number().optional(),
    search: z.string().optional(),
    folder_id: z.number().optional()
  }, async ({ page = 1, per_page = 25, search, folder_id }) => {
    try {
      const q = toQuery({ page, per_page, search, folder_id });
      const res = await api.get(buildURL(managementBase, `assets${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_asset', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `assets/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_asset', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `assets/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Asset ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('init_asset_upload', { filename: z.string(), size: z.number(), content_type: z.string() }, async ({ filename, size, content_type }) => {
    try {
      const res = await api.post(buildURL(managementBase, 'assets'), { filename, size, content_type }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('complete_asset_upload', { asset_id: z.string() }, async ({ asset_id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `assets/${asset_id}/finish_upload`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_asset_folders', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'asset_folders'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_asset_folder', { name: z.string(), parent_id: z.union([z.number(), z.string()]).optional() }, async ({ name, parent_id }) => {
    try {
      const folderData: any = { name };
      if (parent_id !== undefined) folderData.parent_id = parent_id;
      const res = await api.post(buildURL(managementBase, 'asset_folders'), { asset_folder: folderData }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_asset_folder', { id: z.string(), name: z.string() }, async ({ id, name }) => {
    try {
      const res = await api.put(buildURL(managementBase, `asset_folders/${id}`), { asset_folder: { name } }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_asset_folder', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `asset_folders/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Asset folder ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_components', {
    component_summary: z.boolean().optional(),
    include_schema_details: z.boolean().optional(),
    filter_by_name: z.string().optional()
  }, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'components'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_component', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `components/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_component', { name: z.string(), display_name: z.string().optional(), schema: z.record(z.unknown()), is_root: z.boolean().optional(), is_nestable: z.boolean().optional() }, async ({ name, display_name, schema, is_root = false, is_nestable = true }) => {
    try {
      const componentData = { component: { name, display_name: display_name || name, schema, is_root, is_nestable } };
      const res = await api.post(buildURL(managementBase, 'components'), componentData, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_component', { id: z.string(), name: z.string().optional(), display_name: z.string().optional(), schema: z.record(z.unknown()).optional(), is_root: z.boolean().optional(), is_nestable: z.boolean().optional() }, async ({ id, name, display_name, schema, is_root, is_nestable }) => {
    try {
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (display_name !== undefined) updateData.display_name = display_name;
      if (schema !== undefined) updateData.schema = schema;
      if (is_root !== undefined) updateData.is_root = is_root;
      if (is_nestable !== undefined) updateData.is_nestable = is_nestable;
      const res = await api.put(buildURL(managementBase, `components/${id}`), { component: updateData }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_component', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `components/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Component ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('search_stories', {
    starts_with: z.string().optional(),
    by_uuids: z.string().optional(),
    by_slugs: z.string().optional(),
    excluding_slugs: z.string().optional(),
    with_tag: z.string().optional(),
    is_startpage: z.boolean().optional(),
    sort_by: z.string().optional(),
    search_term: z.string().optional(),
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async (params) => {
    try {
      const q = toQuery({ ...params, token: publicToken });
      const res = await api.get(`${CDN_BASE}/stories${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story_by_slug', { slug: z.string() }, async ({ slug }) => {
    try {
      const q = toQuery({ token: publicToken });
      const res = await api.get(`${CDN_BASE}/stories/${slug}${q}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_folders', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'stories?is_folder=true'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_datasources', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(buildURL(managementBase, `datasources${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_datasource', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `datasources/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_datasource', { 
    name: z.string(),
    slug: z.string(),
    dimensions_attributes: z.array(
      z.object({
        name: z.string(),
        entry_value: z.string()
      })
    ).optional()
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'datasources'), { datasource: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_datasource', { 
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
    dimensions_attributes: z.array(
      z.object({
        name: z.string(),
        entry_value: z.string()
      })
    ).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `datasources/${id}`), { datasource: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_datasource', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `datasources/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Datasource ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_datasource_entries', { 
    datasource_id: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ datasource_id, page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(buildURL(managementBase, `datasources/${datasource_id}/entries${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_datasource_entry', { 
    entry_id: z.string()
  }, async ({ entry_id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `datasource_entries/${entry_id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_datasource_entry', { 
    datasource_id: z.string(),
    name: z.string(),
    value: z.string(),
    dimension_values: z.record(z.string()).optional()
  }, async ({ datasource_id, name, value, dimension_values }) => {
    try {
      const entryData: any = { name, value, datasource_id };
      if (dimension_values) entryData.dimension_values = dimension_values;
      const res = await api.post(buildURL(managementBase, 'datasource_entries'), { datasource_entry: entryData }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_datasource_entry', { 
    entry_id: z.string(),
    name: z.string().optional(),
    value: z.string().optional(),
    dimension_value: z.string().optional(),
    dimension_id: z.number().optional()
  }, async ({ entry_id, name, value, dimension_value, dimension_id }) => {
    try {
      const entryData: any = {};
      if (name !== undefined) entryData.name = name;
      if (value !== undefined) entryData.value = value;
      if (dimension_value !== undefined) entryData.dimension_value = dimension_value;
      
      const payload: any = { datasource_entry: entryData };
      if (dimension_id !== undefined) payload.dimension_id = dimension_id;
      
      const res = await api.put(buildURL(managementBase, `datasource_entries/${entry_id}`), payload, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_datasource_entry', { 
    entry_id: z.string()
  }, async ({ entry_id }) => {
    try {
      await api.delete(buildURL(managementBase, `datasource_entries/${entry_id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Datasource entry ${entry_id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('translate_story', {
    story_id: z.string(),
    lang: z.string()
  }, async ({ story_id, lang }) => {
    try {
      const res = await api.put(
        buildURL(managementBase, `stories/${story_id}/ai_translate`), 
        { lang, code: lang, overwrite: false }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_access_tokens', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'api_keys'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_access_token', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `api_keys/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_access_token', {
    access: z.enum(['public', 'private']),
    name: z.string().optional(),
    min_cache: z.number().optional(),
    story_ids: z.array(z.number()).optional(),
    branch_id: z.number().optional()
  }, async (params) => {
    try {
      const api_key: any = { access: params.access };
      if (params.name !== undefined) api_key.name = params.name;
      if (params.min_cache !== undefined) api_key.min_cache = params.min_cache;
      if (params.story_ids !== undefined) api_key.story_ids = params.story_ids;
      if (params.branch_id !== undefined) api_key.branch_id = params.branch_id;
      const res = await api.post(buildURL(managementBase, 'api_keys'), { api_key }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_access_token', {
    id: z.string(),
    access: z.enum(['public', 'private']).optional(),
    name: z.string().optional(),
    min_cache: z.number().optional(),
    story_ids: z.array(z.number()).optional(),
    branch_id: z.number().optional()
  }, async ({ id, ...params }) => {
    try {
      const api_key: any = {};
      if (params.access !== undefined) api_key.access = params.access;
      if (params.name !== undefined) api_key.name = params.name;
      if (params.min_cache !== undefined) api_key.min_cache = params.min_cache;
      if (params.story_ids !== undefined) api_key.story_ids = params.story_ids;
      if (params.branch_id !== undefined) api_key.branch_id = params.branch_id;
      const res = await api.put(buildURL(managementBase, `api_keys/${id}`), { api_key }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_access_token', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `api_keys/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Access token ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_story_schedulings', {
    page: z.number().optional(),
    per_page: z.number().optional(),
    story_id: z.number().optional(),
    language: z.string().optional(),
    sort_by: z.string().optional()
  }, async (params) => {
    try {
      const q = toQuery(params);
      const res = await api.get(buildURL(managementBase, `story_schedulings${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_story_scheduling', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `story_schedulings/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_story_scheduling', {
    story_id: z.number(),
    publish_at: z.string(),
    language: z.string().optional()
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'story_schedulings'), { story_scheduling: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_story_scheduling', {
    id: z.string(),
    publish_at: z.string().optional(),
    language: z.string().optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `story_schedulings/${id}`), { story_scheduling: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_story_scheduling', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `story_schedulings/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Story scheduling ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_presets', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(buildURL(managementBase, `presets${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_preset', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `presets/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_preset', {
    name: z.string(),
    preset: z.record(z.unknown()),
    component_id: z.number(),
    image: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    description: z.string().optional()
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'presets'), { preset: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_preset', {
    id: z.string(),
    name: z.string().optional(),
    preset: z.record(z.unknown()).optional(),
    component_id: z.number().optional(),
    image: z.string().optional(),
    color: z.string().optional(),
    icon: z.string().optional(),
    description: z.string().optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `presets/${id}`), { preset: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_preset', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `presets/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Preset ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_webhooks', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'webhook_endpoints'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_webhook', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `webhook_endpoints/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_webhook', {
    name: z.string(),
    endpoint: z.string(),
    actions: z.array(z.string()),
    secret: z.string().optional(),
    activated: z.boolean().optional()
  }, async (params) => {
    try {
      const res = await api.post(
        buildURL(managementBase, 'webhook_endpoints'), 
        { webhook_endpoint: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_webhook', {
    id: z.string(),
    name: z.string().optional(),
    endpoint: z.string().optional(),
    actions: z.array(z.string()).optional(),
    secret: z.string().optional(),
    activated: z.boolean().optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(
        buildURL(managementBase, `webhook_endpoints/${id}`), 
        { webhook_endpoint: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_webhook', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `webhook_endpoints/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Webhook ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_component_folders', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'component_groups'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_component_folder', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `component_groups/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_component_folder', {
    name: z.string(),
    parent_id: z.union([z.string(), z.number()]).optional()
  }, async (params) => {
    try {
      const res = await api.post(
        buildURL(managementBase, 'component_groups'), 
        { component_group: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_component_folder', {
    id: z.string(),
    name: z.string(),
    parent_id: z.union([z.string(), z.number()]).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(
        buildURL(managementBase, `component_groups/${id}`), 
        { component_group: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_component_folder', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `component_groups/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Component folder ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_space', {}, async () => {
    try {
      const res = await api.get(managementBase, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_spaces', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(`${SPACES_BASE}${q}`, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_space', {
    name: z.string(),
    domain: z.string().optional(),
    owner_id: z.number().optional(),
    story_published_hook: z.string().optional(),
    environments: z.array(z.object({
      name: z.string(),
      location: z.string()
    })).optional(),
    billing_address: z.object({
      tax_number: z.string().optional(),
      order_number: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
      address_city: z.string().optional(),
      address_country: z.string().optional(),
      address_iso_country: z.string().optional(),
      address_line1: z.string().optional(),
      address_zip: z.string().optional()
    }).optional(),
    options: z.object({
      branch_deployed_hook: z.string().optional(),
      s3_bucket: z.string().optional(),
      aws_arn: z.string().optional(),
      backup_frequency: z.string().optional(),
      languages: z.array(z.object({
        code: z.string(),
        name: z.string()
      })).optional(),
    }).optional()
  }, async (params) => {
    try {
      const res = await api.post(SPACES_BASE, { space: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_space', {
    space_id: z.string(),
    name: z.string().optional(),
    domain: z.string().optional(),
    uniq_domain: z.string().optional(),
    owner_id: z.number().optional(),
    story_published_hook: z.string().optional(),
    environments: z.array(z.object({
      name: z.string(),
      location: z.string()
    })).optional(),
    parent_id: z.number().optional(),
    searchblok_id: z.number().optional(),
    duplicatable: z.boolean().optional(),
    billing_address: z.object({
      tax_number: z.string().optional(),
      order_number: z.string().optional(),
      company: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
      address_city: z.string().optional(),
      address_country: z.string().optional(),
      address_iso_country: z.string().optional(),
      address_line1: z.string().optional(),
      address_zip: z.string().optional()
    }).optional(),
    routes: z.array(z.string()).optional(),
    default_root: z.string().optional(),
    has_pending_tasks: z.boolean().optional(),
    ai_translation_disabled: z.boolean().optional(),
    options: z.object({
      branch_deployed_hook: z.string().optional(),
      s3_bucket: z.string().optional(),
      aws_arn: z.string().optional(),
      backup_frequency: z.string().optional(),
      languages: z.array(z.object({
        code: z.string(),
        name: z.string()
      })).optional(),
    }).optional()
  }, async ({ space_id, ...params }) => {
    try {
      const res = await api.put(buildURL(SPACES_BASE, space_id), { space: params }, 
        { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_space', {
    space_id: z.string()
  }, async ({ space_id }) => {
    try {
      await api.delete(buildURL(SPACES_BASE, space_id), 
        { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Space ${space_id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('duplicate_space', {
    space_id: z.string(),
    name: z.string(),
    duplicate_content: z.boolean().optional(),
    create_components: z.boolean().optional()
  }, async ({ space_id, name, duplicate_content = true, create_components = true }) => {
    try {
      const res = await api.post(buildURL(SPACES_BASE, `${space_id}/duplicate`), 
        { 
          duplicate: { 
            name,
            duplicate_content,
            create_components
          } 
        }, 
        { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('backup_space', {
    space_id: z.string(),
  }, async ({ space_id }) => {
    try {
      const res = await api.post(buildURL(SPACES_BASE, `${space_id}/backup`), 
        {}, 
        { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_space_roles', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'space_roles'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_space_role', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `space_roles/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_space_role', {
    role: z.string(),
    subtitle: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    field_permissions: z.array(z.string()).optional(),
    readonly_field_permissions: z.array(z.string()).optional(),
    allowed_paths: z.array(z.number()).optional(),
    datasource_ids: z.array(z.number()).optional(),
    component_ids: z.array(z.number()).optional(),
    branch_ids: z.array(z.number()).optional(),
    allowed_languages: z.array(z.string()).optional(),
    asset_folder_ids: z.array(z.number()).optional()
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'space_roles'), { space_role: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_space_role', {
    id: z.string(),
    role: z.string().optional(),
    subtitle: z.string().optional(),
    permissions: z.array(z.string()).optional(),
    field_permissions: z.array(z.string()).optional(),
    readonly_field_permissions: z.array(z.string()).optional(),
    allowed_paths: z.array(z.number()).optional(),
    datasource_ids: z.array(z.number()).optional(),
    component_ids: z.array(z.number()).optional(),
    branch_ids: z.array(z.number()).optional(),
    allowed_languages: z.array(z.string()).optional(),
    asset_folder_ids: z.array(z.number()).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `space_roles/${id}`), { space_role: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_space_role', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `space_roles/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Space role ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_workflows', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async (params) => {
    try {
      const q = toQuery(params);
      const res = await api.get(buildURL(managementBase, `workflows${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_workflow', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `workflows/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_workflow', {
    name: z.string(),
    content_types: z.array(z.string())
  }, async (params) => {
    try {
      const res = await api.post(buildURL(managementBase, 'workflows'), { workflow: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_workflow', {
    id: z.string(),
    name: z.string().optional(),
    content_types: z.array(z.string()).optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(buildURL(managementBase, `workflows/${id}`), { workflow: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });
  
  server.tool('duplicate_workflow', {
    id: z.string(),
    name: z.string(),
    content_types: z.array(z.string())
  }, async ({ id, ...params }) => {
    try {
      const res = await api.post(buildURL(managementBase, `workflows/${id}/duplicate`), { workflow: params }, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });
  
  server.tool('delete_workflow', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `workflows/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Workflow ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_workflow_stages', {}, async () => {
    try {
      const res = await api.get(buildURL(managementBase, 'workflow_stages'), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_workflow_stage', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `workflow_stages/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_workflow_stage', {
    name: z.string(),
    color: z.string().optional(),
    position: z.number().optional(),
    is_default: z.boolean().optional(),
    allow_publish: z.boolean().optional(),
    allow_all_users: z.boolean().optional(),
    allow_all_stages: z.boolean().optional(),
    allow_admin_publish: z.boolean().optional(),
    allow_admin_change: z.boolean().optional(),
    allow_editor_change: z.boolean().optional(),
    user_ids: z.array(z.number()).optional(),
    space_role_ids: z.array(z.number()).optional(),
    workflow_stage_ids: z.array(z.number()).optional(),
    after_publish_id: z.number().optional(),
    workflow_id: z.number().optional()
  }, async (params) => {
    try {
      const res = await api.post(
        buildURL(managementBase, 'workflow_stages'), 
        { workflow_stage: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_workflow_stage', {
    id: z.string(),
    name: z.string().optional(),
    color: z.string().optional(),
    position: z.number().optional(),
    is_default: z.boolean().optional(),
    allow_publish: z.boolean().optional(),
    allow_all_users: z.boolean().optional(),
    allow_all_stages: z.boolean().optional(),
    allow_admin_publish: z.boolean().optional(),
    allow_admin_change: z.boolean().optional(),
    allow_editor_change: z.boolean().optional(),
    user_ids: z.array(z.number()).optional(),
    space_role_ids: z.array(z.number()).optional(),
    workflow_stage_ids: z.array(z.number()).optional(),
    after_publish_id: z.number().optional(),
    workflow_id: z.number().optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(
        buildURL(managementBase, `workflow_stages/${id}`), 
        { workflow_stage: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_workflow_stage', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `workflow_stages/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Workflow stage ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_workflow_stage_changes', {
    with_story: z.string().optional()
  }, async ({ with_story }) => {
    try {
      const q = with_story ? `?with_story=${with_story}` : '';
      const res = await api.get(buildURL(managementBase, `workflow_stage_changes${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_workflow_stage_change', { 
    workflow_stage_id: z.number(),
    story_id: z.number()
  }, async ({ workflow_stage_id, story_id }) => {
    try {
      const res = await api.post(
        buildURL(managementBase, 'workflow_stage_changes'), 
        { workflow_stage_change: { workflow_stage_id, story_id } }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_workflow_stage_change', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `workflow_stage_changes/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_branches', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async (params) => {
    try {
      const q = toQuery(params);
      const res = await api.get(buildURL(managementBase, `branches${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_branch', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `branches/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_branch', { 
    name: z.string(),
    source_id: z.number().nullable().optional(),
    url: z.string().optional(),
    position: z.number().optional()
  }, async (params) => {
    try {
      const res = await api.post(
        buildURL(managementBase, 'branches'), 
        { branch: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('update_branch', { 
    id: z.string(),
    name: z.string().optional(),
    source_id: z.number().nullable().optional(),
    url: z.string().optional(),
    position: z.number().optional()
  }, async ({ id, ...params }) => {
    try {
      const res = await api.put(
        buildURL(managementBase, `branches/${id}`), 
        { branch: params }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('delete_branch', { id: z.string() }, async ({ id }) => {
    try {
      await api.delete(buildURL(managementBase, `branches/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: `Branch ${id} has been successfully deleted.` }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('deploy_branch', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.post(buildURL(managementBase, `branches/${id}/deploy`), {}, { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_branch_stories', { 
    id: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort_by: z.string().optional()
  }, async ({ id, ...params }) => {
    try {
      const q = toQuery(params);
      const res = await api.get(buildURL(managementBase, `branches/${id}/stories${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('compare_branches', { 
    source_id: z.string(),
    target_id: z.string(),
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ source_id, target_id, ...params }) => {
    try {
      const q = toQuery({ ...params, source: source_id, target: target_id });
      const res = await api.get(buildURL(managementBase, `branches/compare${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('copy_stories_between_branches', { 
    source_branch_id: z.string(),
    target_branch_id: z.string(),
    story_ids: z.array(z.number())
  }, async ({ source_branch_id, target_branch_id, story_ids }) => {
    try {
      const res = await api.post(
        buildURL(managementBase, `branches/${target_branch_id}/stories/copy`), 
        { source_branch_id, story_ids }, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('fetch_branch_deployments', {
    page: z.number().optional(),
    per_page: z.number().optional()
  }, async ({ page = 1, per_page = 25 }) => {
    try {
      const q = toQuery({ page, per_page });
      const res = await api.get(buildURL(managementBase, `deployments${q}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('create_branch_deployment', {
    branch_id: z.number(),
    release_uuids: z.array(z.string()).optional()
  }, async ({ branch_id, release_uuids }) => {
    try {
      const payload: any = { branch_id };
      if (release_uuids && release_uuids.length > 0) {
        payload.release_uuids = release_uuids;
      }
      
      const res = await api.post(
        buildURL(managementBase, 'deployments'), 
        payload, 
        { headers: getHeaders(managementToken) }
      );
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });

  server.tool('get_branch_deployment', { id: z.string() }, async ({ id }) => {
    try {
      const res = await api.get(buildURL(managementBase, `deployments/${id}`), { headers: getHeaders(managementToken) });
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    } catch (error: any) {
      return { isError: true, content: [{ type: 'text', text: `Error: ${error.message}` }] };
    }
  });
}