const { Engine } = require('json-rules-engine');
const apiClient  =  require("../support/account-api-client")
exports.jsonRuleTwo  = (req, res)  => {
      // advanced

  const engine = new Engine();
  async function start() {
    /**
     * Rule for identifying microsoft employees taking pto on christmas
     *
     * the account-information fact returns:
     *  { company: 'XYZ', status: 'ABC', ptoDaysTaken: ['YYYY-MM-DD', 'YYYY-MM-DD'] }
     */
    const microsoftRule = {
      conditions: {
        all: [
          {
            fact: 'account-information',
            operator: 'equal',
            value: 'microsoft',
            path: '$.company', // access the 'company' property of "account-information"
          },
          {
            fact: 'account-information',
            operator: 'in',
            value: ['active', 'paid-leave'], // 'status'' can be active or paid-leave
            path: '$.status', // access the 'status' property of "account-information"
          },
          {
            fact: 'account-information',
            operator: 'contains',
            value: '2016-12-25',
            path: '$.ptoDaysTaken', // access the 'ptoDaysTaken' property of "account-information"
          },
        ],
      },
      event: {
        type: 'microsoft-christmas-pto',
        params: {
          message: 'current microsoft employee taking christmas day off',
        },
      },
    };
    engine.addRule(microsoftRule);

    /**
     * 'account-information' fact executes an api call and retrieves account data, feeding the results
     * into the engine.  The major advantage of this technique is that although there are THREE conditions
     * requiring this data, only ONE api call is made.  This results in much more efficient runtime performance.
     */
    engine.addFact('account-information', function (params, almanac) {
      return almanac.factValue('accountId').then((accountId) => {
        return apiClient.getAccountInformation(accountId);
      });
    });

    // define fact(s) known at runtime
    const facts = { accountId: 'lincoln' };
    const { events } = await engine.run(facts);

    console.log(
      facts.accountId + ' is a ' + events.map((event) => event.params.message)
    );
    res.send(facts.accountId + ' is a ' + events.map((event) => event.params.message))
  }
  start();
}