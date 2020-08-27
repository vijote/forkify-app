import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe()  {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.url = res.config.url;
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error){
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime(){
        // each 3 ingredients mean 15 minutes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'punds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        
        const newIngredients = this.ingredients.map(el => {
            let ingredient = el.toLowerCase();
            
            // make all units be the same
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            })

            // remove parenthesis
            ingredient = ingredient.replace(/\s*\(.*?\)\s*/g, ' ');
            
            // parse ingredients into count, unit and ingrdient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(elem => units.includes(elem));

            let objIng;
            if(unitIndex > -1){
                //there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if (arrCount === 1){
                    count = eval(arrIng[0].replace('-','+'));
                } else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }

            }else if(parseInt(arrIng[0], 10)){
                //there is no unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.splice(1).join(' ')
                }
            } else if(unitIndex === -1){
                // there is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        //servings
        const newServings = type === 'dec' ? this.servings-1 : this.servings+1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    }
}