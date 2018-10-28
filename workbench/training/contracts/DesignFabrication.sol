pragma solidity ^0.4.20;

contract WorkbenchBase {
    event WorkbenchContractCreated(string applicationName, string workflowName, address originatingAddress);
    event WorkbenchContractUpdated(string applicationName, string workflowName, string action, address originatingAddress);

    string internal ApplicationName;
    string internal WorkflowName;

    function WorkbenchBase(string applicationName, string workflowName) internal {
        ApplicationName = applicationName;
        WorkflowName = workflowName;
    }

    function ContractCreated() internal {
        WorkbenchContractCreated(ApplicationName, WorkflowName, msg.sender);
    }

    function ContractUpdated(string action) internal {
        WorkbenchContractUpdated(ApplicationName, WorkflowName, action, msg.sender);
    }
}

contract DesignFabrication is WorkbenchBase("DesignFabrication", "DesignFabrication")
{

    //Set of States
    enum StateType { DesignAccepted, DesignComplete, DesignApproved, SentForFabrication, ReceivedForSupervision, 
    SupervisionComplete, ShipmentApproved, ShipmentReceived }
	
	//List of properties
    StateType public  State;
    string public DesignInfo;
    string public CompleteDesignInfo;
    string public ApproveDesignInfo;
    string public SendForFabricationInfo;
    string public ReceiveDesignInfo;
    string public CompleteSupervisionInfo;
    string public ShipmentSiteInfo;
    string public ReceiveShipmentInfo;

    function DesignFabrication(string designInfo) public
    {
        DesignInfo = designInfo;
        State = StateType.DesignAccepted;  
        ContractCreated();
    }

    function CompleteDesign(string completeDesignInfo) public 
    {
        CompleteDesignInfo = completeDesignInfo;
        State = StateType.DesignComplete;  
        ContractUpdated("CompleteDesign");
    }

    function ApproveDesign(string approveDesignInfo) public 
    {
        ApproveDesignInfo = approveDesignInfo;
        State = StateType.DesignApproved;  
        ContractUpdated("ApproveDesign");
    }

    function SendForFabrication(string sendForFabricationInfo) public 
    {
        SendForFabricationInfo = sendForFabricationInfo;
        State = StateType.SentForFabrication;  
        ContractUpdated("SendForFabrication");
    }

    function ReceiveDesign(string receiveDesignInfo) public 
    {
        ReceiveDesignInfo = receiveDesignInfo;
        State = StateType.ReceivedForSupervision;  
        ContractUpdated("ReceiveDesign");
    }

    function CompleteSupervision(string completeSupervisionInfo) public 
    {
        CompleteSupervisionInfo = completeSupervisionInfo;
        State = StateType.SupervisionComplete;  
        ContractUpdated("CompleteSupervision");
    }

    function ApproveShipment(string shipmentSiteInfo) public 
    {
        ShipmentSiteInfo = shipmentSiteInfo;
        State = StateType.ShipmentApproved;  
        ContractUpdated("ApproveShipment");
    }

    function ReceiveShipment(string receiveShipmentInfo) public 
    {
        ReceiveShipmentInfo = receiveShipmentInfo;
        State = StateType.ShipmentReceived;  
        ContractUpdated("ReceiveShipment");
    }

    function getMEPState() public view returns (uint8)  {
        return uint8(State);
    }

}
