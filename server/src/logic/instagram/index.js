
/**
 * @param  {array of strings} p: the path
 * @param  {object} o: the object
 * @returns {any}: the value at the end of the path or null if not found
 */
const getNestedValue = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o);

const parseImages = (imgs) => 
  imgs
  .map(img => {
    return {
    shortcode: getNestedValue(['shortcode'], img.node),
    thumbnail_src: getNestedValue(['thumbnail_src'], img.node),
    caption: getNestedValue(['edge_media_to_caption', 'edges', 0, 'node','text'], img.node),
    likeCount: getNestedValue(['edge_liked_by', 'count'], img.node),
    commentCount: getNestedValue(['edge_media_to_comment', 'count'], img.node)
  }});

  
const fetchInstas =  async ({tag, count}) => { 
  const url = `https://www.instagram.com/explore/tags/${tag}/?__a=1`;

  const json = await fetch(url);
  const data = await json.json();
  const tagName = getNestedValue(['graphql', 'hashtag', 'name'], data);
  let media = getNestedValue(['graphql', 'hashtag', 'edge_hashtag_to_media', 'edges'], data);
  media = !!media ? parseImages(media) : [];
  media = media.slice(0, count);
  return media;
 
}

export default fetchInstas;