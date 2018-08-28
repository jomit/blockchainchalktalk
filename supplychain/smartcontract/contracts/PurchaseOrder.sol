// solium-disable linebreak-style
pragma solidity ^0.4.10;

contract PurchaseOrder {

    enum OrderStates {Received, Acknowledged, Changed, ASN, Invoice  }
    address private owner;
    bytes32 private receivePOData;
    bytes32[] private sendPOAckData;
    bytes32[] private receivePOChangeData;
    bytes32 private sendASNData;
    bytes32 private sendInvoiceData;
    OrderStates state;
    event StateChanged(string action, address who, bytes32 dataHash); 

    // Received PO EDI-850
    constructor(string data) public {
        owner = msg.sender;
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        receivePOData = dataHash; 
        state = OrderStates.Received;
        emit StateChanged("created",msg.sender, dataHash);
    }
    // Send PO Ack EDI-855
    function sendPOAck(string data) public {
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        sendPOAckData.push(dataHash); 
        state = OrderStates.Acknowledged;
        emit StateChanged("sendPOAck",msg.sender, dataHash);
    }
    // Receive PO Change EDI-860
    function receivePOChange(string data) public {
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        receivePOChangeData.push(dataHash);
        state = OrderStates.Changed;
        emit StateChanged("receivePOChange",msg.sender, dataHash);
    }
    // Send ASN EDI-856
    function sendASN(string data) public {
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        sendASNData = dataHash; 
        state = OrderStates.ASN;
        emit StateChanged("sendASN",msg.sender, dataHash);
    }
    // Send Invoice EDI-810
    function sendInvoice(string data) public {
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        sendInvoiceData = dataHash; 
        state = OrderStates.Invoice;
        emit StateChanged("sendInvoice",msg.sender, dataHash);
    }

    function getState() public view returns (uint8) {
        return uint8(state);
    }
}