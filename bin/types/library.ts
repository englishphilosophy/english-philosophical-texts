export type Data = Author | Text

export const isAuthor = (data: Data): data is Author => 'forename' in data

export const isText = (data: Data): data is Text => 'blocks' in data

export type Author = {
  id: string
  forename: string
  surname: string
  title?: string
  birth: number
  death: number
  published: number
  nationality: string
  sex: 'Male' | 'Female'
  texts: TextStub[]
}

export type TextStub = {
  id: string
  imported?: boolean
  duplicate?: boolean
  title: string
  breadcrumb: string
  published: number[]
}

export type SourceText = {
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
  blocks: Block[]
  texts: TextStub[]
}

export type Text = SourceText & {
  ancestors: [Author, ...TextStub[]]
  prev?: TextStub
  next?: TextStub
}

export type Block = {
  id: string
  author?: string
  type: string
  pages?: string
  speaker?: string
  content: string
}
