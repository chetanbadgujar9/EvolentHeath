export class VendorCommunication {
    constructor(
        public ID: string,
        public ItemID: any,
        public RevID: any,
        public ItemDescription: string,
        public Brand: string,
        public Project: string,
        public System: string,
        public Category: string,
        public Requirement: string,
        public Vendor: string,
        public RaisedBy: { 'Name': string, 'ID': string },


        public Title: string,
        public DescriptionOnData_: string,
        public GLApproval: string,
        public GLComments: string,
        public CDApproval: string,
        public CDComments: string,
        public VendorComments: string,
        public VendorStatus: string,
        public GLStatus: string,
        public CDStatus: string,
        public Status: string,
        public GLName: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public CDName: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VendorName: [
            {
                "Title": string,
                "Name": string,
                "ID": string
            }
        ],
        public vendorview: string,
        public DiscussionLink: string,
        public AttachedDocuments: string,
        public VendorCommunication: string,
        public CD1: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public CD2: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public CD3: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public CD4: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VendorName2: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VendorName3: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VendorName4: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VendorName5: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify1: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify2: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify3: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify4: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify5: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify6: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify7: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify8: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Notify9: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public VehicleBrand: string,
        public RequestDate: any,
        public Admin: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public ShowTo: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Author: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public CreatedBy: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Editor: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public ModifiedBy: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Created: any,
        public Modified: any,
        public Attachments: true,
        public AttachmentFiles: [
            {
                "FileName": string,
                "ServerRelativeUrl": string
            }
        ],
        public Route: any

    ) { }
}
