export default class Block {
  id: string = ''
  type: string = ''
  pages?: string
  speaker?: string
  content: string = ''

  constructor (data?: any) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.type) this.type = data.type
      if (data.pages) this.pages = data.pages
      if (data.speaker) this.speaker = data.speaker
      if (data.content) this.content = data.content
    }
  }
}
