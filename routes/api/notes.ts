import { HandlerContext } from "$fresh/server.ts";

const NOTES = [
  "Successfully managed a team of 15 employees, resulting in a 20% increase in productivity within six months.",
  "Developed and implemented a cost-saving strategy that saved the company $50,000 annually.",
  "Led a cross-functional project team to launch a new product, resulting in a 15% boost in revenue within the first quarter.",
  "Consistently exceeded sales targets, achieving a 30% increase in revenue year over year.",
  "Streamlined internal processes, reducing project completion time by 20% and enhancing overall efficiency.",
  "Built strong client relationships, resulting in a 40% increase in customer retention rate.",
  "Received recognition for outstanding customer service, with a 95% satisfaction rating from clients.",
  "Created and executed a comprehensive marketing campaign, driving a 50% increase in website traffic.",
  "Implemented a training program that improved employee performance by 25% and reduced turnover by 15%.",
  "Developed and managed a social media strategy that increased brand awareness by 60% and generated leads.",
];

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const randomIndex = Math.floor(Math.random() * NOTES.length);
  const body = NOTES[randomIndex];
  return new Response(body);
};
