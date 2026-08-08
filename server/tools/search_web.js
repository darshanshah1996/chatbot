import { DDGS } from '@phukon/duckduckgo-search';

export default class SearchWeb {
  #ddgs = new DDGS();

  async _call(query) {
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

      return 'Something went wrong.';
    }
  }
}
