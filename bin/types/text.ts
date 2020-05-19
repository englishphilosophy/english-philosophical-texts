import Block from './block.ts'

export default class Text {
  id: string = ''
  imported: boolean = false
  duplicate?: string
  parent?: string
  title: string = ''
  breadcrumb: string = ''
  published: number[] = []
  copytext: number[] = []
  sourceDesc: string = ''
  sourceUrl: string = ''
  texts: Text[] = []
  blocks: Block[] = []

  constructor (data?: any) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.imported) this.imported = data.imported
      if (data.duplicate) this.duplicate = data.duplicate
      if (data.parent) this.parent = data.parent
      if (data.title) this.title = data.title
      if (data.breadcrumb) this.breadcrumb = data.breadcrumb
      if (data.published) this.published = data.published
      if (data.copytext) this.copytext = data.copytext
      if (data.sourceDesc) this.sourceDesc = data.sourceDesc
      if (data.sourceUrl) this.sourceUrl = data.sourceUrl
      if (data.texts) this.texts = data.texts.map((x: any) => new Text(x))
      if (data.blocks) this.blocks = data.blocks.map((x: any) => new Block(x))
    }
  }
}
