export interface Movie {
  id?: number
  title: string
  year: number
  rating: "G" | "PG" | "M" | "MA" | "R"
}