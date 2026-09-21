export type MenuItem = {
  id: string;
  name: string;
  vegetarian: boolean;
};

const menuItems: readonly MenuItem[] = [
  { id: "margherita-pizza", name: "Margherita pizza", vegetarian: true },
  { id: "ramen", name: "Pork ramen", vegetarian: false },
  { id: "falafel-bowl", name: "Falafel bowl", vegetarian: true },
  { id: "steak-frites", name: "Steak frites", vegetarian: false },
];

export function createMenuResponse(request: Request): Response {
  const url = new URL(request.url);
  const vegetarian = url.searchParams.get("vegetarian");
  const items = vegetarian
    ? menuItems.filter((item) => item.vegetarian)
    : menuItems;

  return Response.json({ items });
}
