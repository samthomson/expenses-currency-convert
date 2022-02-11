# expenses-currency-convert

Read in an **Iexpense lite** generated csv file and convert all expenses from one currency to another and save as new csv.

## setup

create env file: `cp .env.sample .env`

`docker-compose build`

install yarn deps: `docker-compose run app yarn`

## run

**Either:**
bash into the `app` container with `docker-compose run app sh` and then run `yarn run init` separately, staying in the container's scope.
***or***
run the script in the container from outwith the container (on the/your host machine), `docker-compose run app yarn run init`, then return to the host scope after.
