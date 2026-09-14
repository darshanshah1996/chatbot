import { DDGS } from '@phukon/duckduckgo-search';
import { Firecrawl } from 'firecrawl';
import api from '../data/api.js';

export default class SearchWeb {
  #ddgs = new DDGS();
  #firecrawl = new Firecrawl({
    apiKey: api.firecrawl.apiKey,
  });

  async #searchDuckDuckGo(query) {
    try {
      const results = await this.#ddgs.text({
        keywords: query,
        maxResults: 7,
      });

      const formattedResult = results
        .map(
          (result) =>
            `title: ${result.title}\nhref: ${result.href}\nbody: ${result.body}\n\n`,
        )
        .join('\n');

      return formattedResult;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async #searchFirecrawl(query) {
    try {
      const result = await this.#firecrawl.search(query, { limit: 3 });
      const webResult = result.web;
      const formattedResult = webResult
        .map(
          (result) =>
            `title: ${result.title}\nhref: ${result.url}\nbody: ${result.description}\n\n`,
        )
        .join('\n');

      return formattedResult;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async _call(query) {
    let searchResult = await this.#searchFirecrawl(query);

    if (!searchResult) {
      // Fallback to DuckDuckGo search if Firecrawl fails
      console.log('Fallback to DuckDuckGo search');

      searchResult = await this.#searchDuckDuckGo(query);
    }

    return searchResult;
  }
}
