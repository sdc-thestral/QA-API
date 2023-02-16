importserver="localhost"
importport="27017"
importdb="questionanswer"
importcollection="answer_photos"
importFile="/Users/ctunakan/SDC/answers_photos.csv"

mongoimport --host $importserver --port $importport --db $importdb --collection $importcollection --type csv --file $importFile --headerline