import Text from './text.ts'

export default class Author {
  id: string = ''
  forename: string = ''
  surname: string = ''
  title?: string
  birth: number = 0
  death: number = 0
  published: number = 0
  nationality: string = ''
  sex: 'Male'|'Female' = 'Male'
  texts: Text[] = []

  constructor (data?: any) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.forename) this.forename = data.forename
      if (data.surname) this.surname = data.surname
      if (data.title) this.title = data.title
      if (data.birth) this.birth = data.birth
      if (data.death) this.death = data.death
      if (data.published) this.published = data.published
      if (data.nationality) this.nationality = data.nationality
      if (data.sex) this.sex = data.sex
      if (data.texts) this.texts = data.texts.map((x: any) => new Text(x))
    }
  }
}
