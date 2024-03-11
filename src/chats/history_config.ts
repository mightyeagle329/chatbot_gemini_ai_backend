export class ChatRoleContext {
  
  static getResponseWithLinks(): any {
    return [
      { role: "user", parts: "Help me learn" },
      { role: "model", parts: "What do you want to learn?" },
      { role: "user", parts: "Algebra" },
      { role: "model", parts: "What level of Mathematics do you need?" },
      { role: "user", parts: "High School" },
      {
        role: "model",
        parts: "I will put together a learning roadmap for you. Wait a minute!",
      },
      {
        role: "user",
        parts:
          "I want my response as a list of JSON objects with: title, description, link. Check that links are valid and do not return a 404",
      },
      {
        role: "model",
        parts: "OK, list coming up!",
      },
    ];
  }

  static getResponseWithText(): any {
    return [
      { role: "user", parts: "Help me learn" },
      { role: "model", parts: "What do you want to learn?" },
      { role: "user", parts: "Calculus" },
      { role: "model", parts: "What level of Mathematics do you need?" },
      { role: "user", parts: "High School" },
      {
        role: "model",
        parts: "I will put together a learning roadmap for you. Wait a minute!",
      },
      {
        role: "user",
        parts:
          "I want my response as a list of titled paragraphs or essay"  },
     
    ];
  }
}
