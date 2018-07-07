export class VendorDiscussion {
    constructor(
        public ID: string,
        public DisussionTitle: any,
        public DateTime: any,
        public Category: string,
        public Description: string,
        public Vendor: string,
        public CreatedBy: {
            "Title": string,
            "Name": string,
            "ID": string
        },
        public Route: any
    ) { }
}
