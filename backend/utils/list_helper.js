//npm install cross-env

const dummy = (blogs) => {
    return 1
  }

function addition(total, newer){
    return total + newer
}

function totalLikes(blogs){

    if(blogs.length == 0){
        return 0
    }

    const blogLikes = []  
    for (let i = 0; i < blogs.length; i++) {
        blogLikes.push(blogs[i].likes);
   }

   return blogLikes.reduce(addition)
}
  
  module.exports = {
    dummy,
    totalLikes
  }