const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const threeBlogs = [
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Character Studies in Cinema',
      author: 'Sura Kendel',
      url: 'https://www.youtube.com/playlist?list=PLFqTvOsjFbRpUShtLy2nJBjl-3IohCEph',
      likes: 42,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17g0',
      title: 'Life of a Maine Coon',
      author: 'Faar Scayze',
      url: 'https://www.youtube.com/watch?v=BKkvrvYXeYI',
      likes: 15,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17g1',
      title: 'All Things Organized Crime',
      author: 'Denevoir Lensky',
      url: 'https://www.youtube.com/watch?v=Y05wiQQbFLU',
      likes: 14,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result2 = listHelper.totalLikes(listWithOneBlog)
    expect(result2).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result3 = listHelper.totalLikes(threeBlogs)
    expect(result3).toBe(71)
  })

})