FORMAT: 1A

# Wordnet MBaaS Server

Provides dictionary service for words.
Scrapes <http://wordnetweb.princeton.edu/perl/webwn>.

For demo purposes only! You should not scrape any web site in real world!

# Group Wordnet API

## definition [/definition]

'Wordnet definition' endpoint.

### /definition{?word} [GET]

Returns the definition of the given word.
If there are multiple, returns the first noun definition.

+ Parameters
    + word: apple (string) - A URL encoded word

+ Response 200 (application/json)
    + Body
            {
              "definition": "fruit with red or yellow or green skin and sweet to tart crisp whitish flesh"
            }
