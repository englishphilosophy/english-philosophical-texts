export type Author = {
  id: string
  forename: string
  surname: string
  title?: string
  birth: number
  death: number
  published: number
  nationality: string
  sex: 'Male'|'Female'
  texts: Text[]
}

export type Text = {
  id: string
  imported?: boolean
  duplicate?: string
  parent?: string
  title: string
  breadcrumb: string
  published: number[]
  copytext: number[]
  sourceDesc: string
  sourceUrl: string
  texts: Text[]
  blocks: Block[]
}

export type Block = {
  id: string
  type: string
  pages?: string
  speaker?: string
  content: string
}
