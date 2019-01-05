# Retirement Calculator my2582.github.io
Exploratory Data Analysis & Vasualization (EDAV) Project, Fall 2018, Columbia University - av2354_jj2980_my2582
It's publically accessible at [here](https://my2582.github.io).

# Questions that the calculator answers
  ● Based on your age and Household Income(HHI), how much do you need to save for a comfortable retirement.
  ● Given your current rate of savings, what is your shortfall dollar amount at retirement, and how much more do you need to save annually to meet your goal.
  ● How much better off you would be, in dollar terms, if you start investing sooner rather than later.

# What the tool computes
We mainly calculated data based on our expertise in finance. This interactive component computed :
  ● Total amount of money needed at retirement.
  ● A wealth curve; this is a total value of your retirement portfolio from an input age until retirement.
  ● Retirement checkpoints; this is the only external data used in this
component. This table takes inputs of age and household income and outputs a required amount of money you should have today to meet your current standard of living in retirement.
 
# How does it work?
We take four values as inputs: age, household income, annual savings, and current savings. After discussion with team members, we fixed the number of user inputs to be as small as possible. If not, user engagement is expected to significantly drop and it might take user’s interest away.
Once a user clicks the start button, the component plots a red circle. This is the required amount of money to meet your standard of living in retirement. Let me call value the goal through section. Then, a green line is gradually plotted. This is an expected value of your retirement portfolio, or “wealth curve”.
You will rely on this, and you should expect the wealth curve to hit the goal at an age of 65, implying that you would enjoy your life without financial difficulties! By introducing animation on this wealth curve, we expect that users can get some excitement (or disappointment) that it would hit the goal or now while it is being drawn. Finally, users can decode the numbers shown on the chart because we explain it. User-friendly texts are shown to go over the result.
