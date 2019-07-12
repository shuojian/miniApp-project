import { HTTP } from '../utils/http.js'

class BookModel extends HTTP{
  data = null
  getHotList(){
    return this.request({
      url: 'book/hot_list'
  })
}

}

export { BookModel }

