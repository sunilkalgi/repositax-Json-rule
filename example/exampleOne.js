const { Engine } = require('json-rules-engine');
exports.jsonRuleOne  = (req, res)  => {
    let engine = new Engine();

    //   define a rule for detecting the player has exceeded foul limits.  Foul out any player who:
    //   (has committed 5 fouls AND game is 40 minutes) OR (has committed 6 fouls AND game is 48 minutes)
      engine.addRule({
        conditions: {
          any: [
            {
              all: [
                {
                  fact: 'gameDuration',
                  operator: 'equal',
                  value: 40,
                },
                {
                  fact: 'personalFoulCount',
                  operator: 'greaterThanInclusive',
                  value: 5,
                },
              ],
            },
            {
              all: [
                {
                  fact: 'gameDuration',
                  operator: 'equal',
                  value: 48,
                },
                {
                  fact: 'personalFoulCount',
                  operator: 'greaterThanInclusive',
                  value: 6,
                },
              ],
            },
          ],
        },
        event: {
          // define the event to fire when the conditions evaluate truthy
          type: 'fouledOut',
          params: {
            message: 'Player has fouled out!',
          },
        },
      });
      let facts = {
        personalFoulCount: 6,
        gameDuration: 40,
      };
    
      // Run the engine to evaluate
      engine.run(facts).then(({ events }) => {
        events.map((event) =>
        // (event.params.message)
         console.log(event.params.message)
         );
      });
}