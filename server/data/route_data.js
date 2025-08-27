const routes = {
  ApplicationRoute:
    "Use this route when yopu wan to launch or open an application in the system",
  CodeRoute:
    "Use this rouute when the question is associated with writing a program or code or technical questions related to programming or coding",
  GeneralRoute:
    "Use this route when the question is related to general knowledge or general questions related to general knowledge",
};

export function getFormattedRoutes() {
  let formattedRoutes = "";

  for (const [name, desc] of Object.entries(routes)) {
    formattedRoutes = formattedRoutes.concat(`${name} - ${desc}`).concat("\n");
  }

  return formattedRoutes;
}
