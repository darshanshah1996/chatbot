const routes = {
  ToolRoute:
    'Use this route when you wan to launch or open an application in the system or you want to access real time information from web e.g. current gold price, any product information etc.',
  CodeRoute:
    'Use this route when the question is associated with writing a program or code or technical questions related to programming or coding or associated with any technical concept related to computer science or programming',
  GeneralRoute:
    'Use this route when the question is related to general knowledge or general questions related to general knowledge',
};

export function getFormattedRoutes() {
  let formattedRoutes = '';

  for (const [name, desc] of Object.entries(routes)) {
    formattedRoutes = formattedRoutes.concat(`${name} - ${desc}`).concat('\n');
  }

  return formattedRoutes;
}
