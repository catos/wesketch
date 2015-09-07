# Project layout

```
src/
	client/
		app/
			blocks/
			core/
			home/				Default route '/' navigates to this "dashboard"
			layout/

			users/
				users.module.js
			recipes/
				recipes.module.js
			feature3/			

			app.module.js			
		css/
		images/
		favicon.ico
		index.html
		
	server /
```

# Food sites
- http://allrecipes.com/
- http://www.frutimian.no/
- http://trinesmatblogg.no/
- http://matprat.no
- http://foodwishes.blogspot.no/

# Recipe model
```
Recipe
	Name
	Image
	Description				Chef's comment on recipe
	StepByStep				How to make the stuff
	ActiveTimeToMake		0-20, 20-40, 40-60, 60+
	PassiveTimeToMake
	Difficulty				Easy, Intermediate, Advanced
	Category				Dinner, Dessert, Salad, Cake, Drink
	[Tags]
		Name				Vegetarian, Healthy, Chinese
	Servings				Number of servings on with displayed ingredients				
	[Ingredients]
		Name
		Amount
		Unit
		Comment
	[Comments]
		Comment
		Created
		CreatedBy
	Rating					1-5 stars: Really bad, Bad, Ok, Good, Very Good
	CreatedBy
	Credit					
```
