document.getElementById("recipeSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("recipeInput").value;
    console.log(value);
    // recipe results
    const url = "https://api.spoonacular.com/recipes/complexSearch?query=" + value + "&APPID=5fae83dbead54952bc960cabc88098ea";
    fetch(url)
        .then(function(response) {
        return response.json();
    }).then(function(json) {
        console.log(json);
        let results = "";
        results += '<h1>Results for ' + value + "</h2>";
        for (let i=0; i < json.results.length; i++) {
            results += '<img src="https://spoonacular.com/recipeImages/' + json.results[i].id + '-312x231.jpg"/>'
            results += '<h2>' + json.results.title + "</h2>"        }
        results += "<p>Description: "
        for (let i=0; i < json.weather.length; i++) {
            /* results += json.weather[i].description
            if (i !== json.weather.length - 1)
                results += ", "*/
        }
        results += "</p>";
        
        document.getElementById("recipeResults").innerHTML = results;
    });
});
