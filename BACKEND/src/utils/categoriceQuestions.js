module.exports = {
    categorice:(data)=>{
        return data.reduce((acc,val)=>{
            const { Category, Question } = val;
            if(!acc[Category]){
                acc[Category] = [];
            }
            acc[Category].push(val);
            return acc
        },{})
    }
}