
const host = 'http://34.88.106.123:3000';

const transactionParcel = (recordId, values) => {
    const url = host + "/submit_pfb";
    const payload = {
        namespace_id: recordId,
        data: values,
        gas_limit: 80000,
        fee: 2000,
    };

    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
        mode: "no-cors"
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const tx_info = JSON.parse(JSON.stringify(data));
            const height = tx_info["height"];
            const txhash = tx_info["txhash"];
            renderResult('transaction', recordId, height, txhash, data);
        })
        .catch((error) => {
            console.error(error);
        }).finally(() => {
        });
};

const blockHeightParcel = (recordId, values) => {
    const url = host + `/namespaced_shares/${recordId}/height/${values}`;

    fetch(url, {
        mode: "no-cors"
    })
        .then((response) => response.json())
        .then((data) => {
            const tx_info = JSON.parse(JSON.stringify(data));
            const height = tx_info["height"];
            renderResult('blockHeight', recordId, height, null, data);
        })
        .catch((error) => console.error(error))
        .finally(() => {
        });
};

const renderResult = (type, namespaceId, height, txHash, rawData) => {
    let title = '';
    let text = '';
    if (type === 'transaction') {
        title = 'PFB data';
        text = `
            <p> - Namespace ID: <code><b>${namespaceId}</b></code><p>
            <p> - Submitted block height: <code><b>${height}</b></code><p>
            <p> - Transaction hash: <code><b>${txHash}</b></code><p>
			<p> - FPB TXH link: <b><a href="https://testnet.mintscan.io/celestia-incentivized-testnet/txs/${txHash}"> PFB TXH link</a></b><p>
            <p><h3> B. Detail PFB transaction info:</h3></p>
            <textarea name="response" style="width: 100%; height: 300px; border: 1px solid #ccc; overflow: auto;">
                ${JSON.stringify(rawData, null, 2)}
            </textarea>
        `;
    } else {
        title = "Namespaced Shares"
        text = `
            <p> - Namespace ID: <code><b>${namespaceId}</b></code><p>
            <p> - Submitted block height: <code><b>${height}</b></code><p>
            <h2>B. Detail info:</h2>
            <textarea name="response" style="width: 100%; height: 300px; border: 1px solid #ccc; overflow: auto;">
                ${JSON.stringify(rawData, null, 2)}
            </textarea>
        `;
    }

    console.log(title, text);

    var modal = $('#modal');
    modal.find('.modal-title').text(title);
    modal.find('.modal-body').html(text);

    $('#modal').modal('show');

};

$('#pfbbutton').click(function (e) {
    e.preventDefault();
    const namespaceId = $('#namespaceid').val();
    const data = $('#data').val();
    console.log(namespaceId, data);
    transactionParcel(namespaceId, data);
});

$('#namespacebutton').click(function (e) {
    e.preventDefault();
    const namespaceId2 = $('#namespaceid2').val();
    const blockheight = $('#blockheight').val();
    console.log(namespaceId2, blockheight);
    blockHeightParcel(namespaceId2, blockheight);
});

$('#modal').modal({show: false});
