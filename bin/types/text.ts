export type Text = Index|Author|Collection|Document

export type Group = Index|Author|Collection

export class Index {
  id: 'index'
  texts: Author[]

  constructor (data: any) {
    this.id = 'index'
    this.texts = data.texts.map((x: any) => new Author(x))
  }
}

export class Author {
  id: string
  forename: string
  surname: string
  title?: string
  birth: number
  death: number
  published: number
  nationality: string
  sex: 'Male'|'Female'
  texts: Stub[]

  constructor (data: any) {
    this.id = data.id
    this.forename = data.forename
    this.surname = data.surname
    this.title = data.title
    this.birth = data.birth
    this.death = data.death
    this.published = data.published
    this.nationality = data.nationality
    this.sex = data.sex
    this.texts = data.texts.map((x: any) => new Stub(x))
  }
}

export class Stub {
  id: string
  imported: boolean
  title: string
  breadcrumb: string
  published: number
  copytext: number
  sourceDesc: string
  sourceUrl: string
  
  constructor (data: any) {
    this.id = data.id
    this.imported = data.imported || false
    this.title = data.title
    this.breadcrumb = data.breadcrumb
    this.published = data.published
    this.copytext = data.copytext
    this.sourceDesc = data.sourceDesc
    this.sourceUrl = data.sourceUrl
  }
}

export class Collection extends Stub {
  texts: Stub[]
  blocks: Block[]

  constructor (data: any) {
    super(data)
    this.texts = data.texts.map((x: any) => new Stub(x))
    this.blocks = data.blocks.map((x: any) => new Block(x))
  }
}

export class Document extends Stub {
  blocks: Block[]

  constructor (data: any) {
    super(data)
    this.blocks = data.blocks.map((x: any) => new Block(x))
  }
}

export class Block {
  id: string
  content: string
  
  constructor (data: any) {
    this.id = data.id
    this.content = data.content
  }
}
