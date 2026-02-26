export type Entry = {
  entryId: string
  type: "note" | "paper" | "blog" | "discussion" | "resource"
  title: string
  tags: string[]
  summary: string
  content: string
  sourceUrl?: string
  sourceFile: string
  createdAt: string
  updatedAt: string
}
