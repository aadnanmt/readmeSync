export async function fetchData(query: string) {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error("GH_TOKEN is missing. Check again,");

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error(result.errors);
    throw new Error("Graphql error!");
  }
  return result.data;
}
