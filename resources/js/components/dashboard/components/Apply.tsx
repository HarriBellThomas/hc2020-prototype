import React, { Component } from "react";
import { Page, Card, Banner, DropZone, Button, ButtonGroup, Stack, Subheading, TextStyle, TextField, Heading, PageActions, Layout, Select, FormLayout } from "@shopify/polaris";
import axios from 'axios';
import { IApplicationRecord } from "../../../interfaces/dashboard.interfaces";
import countryList from 'country-list';
import { toast } from 'react-toastify';

interface IApplyProps {
    canEdit: boolean,
    initialRecord: IApplicationRecord | undefined,
    updateApplication: (application: IApplicationRecord) => void,
}

interface IApplyState {
    uploadedFileURL?: string | undefined,
    uploadedFileName?: string | undefined,
    isUploadingFile: boolean,
    isSaving: boolean,
    questionValues: { [key: string]: string },
    isSubmitted: boolean,
    countrySelection: string,
}

function RequiredStar() {
    return <span style={{ color: "red" }}>*</span>;
}

class Apply extends Component<IApplyProps, IApplyState> {

    state = {
        isUploadingFile: false,
        isSaving: false,
        uploadedFileName: this.props.initialRecord ? (this.props.initialRecord.cvFilename || "") : "",
        uploadedFileURL: this.props.initialRecord ? (this.props.initialRecord.cvUrl || "") : "",
        questionValues: (this.props.initialRecord ? JSON.parse(this.props.initialRecord.questionResponses) : {}) as { [key: string]: string },
        isSubmitted: this.props.initialRecord ? this.props.initialRecord.isSubmitted : false,
        countrySelection: this.props.initialRecord ? this.props.initialRecord.country : "GB",
    }


    private textFieldQuestions: { id: string, title: string, placeholder: string }[] = [
        { id: "1", title: "What do you want to get out of this event?", placeholder: "" },
        { id: "2", title: "What are you interested in?", placeholder: "Mention anything you want -- it doesn’t have to be technology-related!" },
        { id: "3", title: "Tell us about a recent accomplishment you’re proud of.", placeholder: "" },
        { id: "4", title: "Are there any links you’d like to share so we can get to know you better?", placeholder: "For example GitHub, LinkedIn or your website. Put each link on a new line. " },
    ]

    private buildFileSelector() {
        const fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.setAttribute('accept', 'application/pdf');
        fileSelector.onchange = (_) => {
            if(!this.state.isUploadingFile) {
                this.setState({ isUploadingFile: true });
            }
            console.log(fileSelector.files);

            if(fileSelector.files) {
                const file = fileSelector.files.item(0);
                if(file) {
                    this.setState({ 
                        isUploadingFile: false,
                        uploadedFileName: file.name,
                        uploadedFileURL: "https://google.com"
                    }, () => this.saveForm(this.state.isSubmitted, () => toast.success("CV uploaded.")));
                    return;
                } 
            }

            this.setState({ isUploadingFile: false });
        }
        fileSelector.onclick = (_) => {
            fileSelector.value = "";
        }
        return fileSelector;
    }

    private fileSelector: HTMLElement
    componentDidMount(){
        this.fileSelector = this.buildFileSelector();
        this.loadApplicationRecord();
    }

    handleFileSelect = () => {
        // e.preventDefault();
        this.fileSelector.click();
    }

    handleCVRemove = () => {
        this.setState({
            uploadedFileName: "",
            uploadedFileURL: "",
        }, () => this.saveForm(this.state.isSubmitted, () => toast.info("CV removed.")));
    }

    private saveForm(submitted: boolean, customToast?: () => void) {
        this.setState({ isSaving: true });
        this.updateRecordInDatabase(submitted, customToast);
    }

    render() {
        const { 
            isUploadingFile, 
            uploadedFileName, 
            uploadedFileURL, 
            questionValues,
            isSubmitted,
            isSaving,
            countrySelection,
        } = this.state;

        const countriesNoGB = countryList().getData()
            .filter(({ code }: { code: string }) => code !== "GB")
            .map(({ code, name }: { code: string, name: string }) => {
                return { label: name, value: code };
            });
        const countries: { value: string, label: string }[] = [
            { value: "GB", label: "United Kingdom" },
            ...countriesNoGB
        ]

        return (
            <Page title={"Apply for Hack Cambridge"}>
                <Banner status="info">
                    {this.props.canEdit 
                        ? <p>You change this information at any time before the 10th November application deadline.</p>
                        : <p>Applications have now closed.</p>
                    }
                </Banner>
                <br />
                <Card sectioned>
                    <FormLayout>
                        <FormLayout.Group>
                            <>
                            <div style={{ paddingBottom: "12px", paddingTop: "0px" }}>
                                <Heading>CV / Resume</Heading>
                            </div>
                            {uploadedFileName.length > 0 
                                ?   <ButtonGroup segmented>
                                        <Button outline size="slim" url={uploadedFileURL}>{uploadedFileName}</Button>
                                        <Button destructive size="slim" onClick={this.handleCVRemove} disabled={!this.props.canEdit || isSaving}>Remove</Button>
                                    </ButtonGroup>
                                :   <Button size="slim" loading={isUploadingFile} onClick={this.handleFileSelect} disabled={!this.props.canEdit}>Upload CV</Button>
                            }
                            </>
                            <>
                            <div style={{ paddingBottom: "12px", paddingTop: "0px" }}>
                                <Heading>Country Travelling From</Heading>
                            </div>
                            <Select
                                label=""
                                options={countries}
                                onChange={(value) => this.setState({ countrySelection: value })}
                                value={countrySelection}
                                disabled={!this.props.canEdit || isSaving}
                            />
                            </>
                        </FormLayout.Group>
                    </FormLayout>
                </Card>

                <Card sectioned>
                    {this.textFieldQuestions.map((q, index) => {
                        return (
                            <div key={q.id}>
                                <div style={{ paddingBottom: "12px", paddingTop: (index == 0 ? "0" : "20px") }}>
                                    <Heading>{q.title}</Heading>
                                </div>
                                <TextField
                                    id={q.id}
                                    label=""
                                    value={q.id in questionValues ? questionValues[q.id] : ""}
                                    onChange={(value) => {
                                        const newValues = questionValues;
                                        newValues[q.id] = value;
                                        this.setState({ questionValues: newValues });
                                    }}
                                    multiline={4}
                                    placeholder={q.placeholder}
                                    disabled={!this.props.canEdit}
                                    showCharacterCount
                                />
                            </div>
                        );
                    })}
                </Card>

                {this.props.canEdit ? <>
                    {isSubmitted 
                        ? <div>
                            <div style={{ float: "left", padding: "30px 0" }}>
                                <Button destructive loading={isSaving} onClick={() => this.saveForm(false)}>Unsubmit</Button>
                            </div>
                            <div style={{ float: "right", padding: "30px 0" }}>
                                <Button loading={isSaving} primary onClick={() => this.saveForm(true)}>Update</Button>
                            </div>
                        </div>
                        : <div style={{ float: "right", padding: "30px 0" }}>
                            <ButtonGroup segmented>
                                <Button loading={isSaving} onClick={() => this.saveForm(false)}>Save Draft</Button>
                                <Button loading={isSaving} primary onClick={() => this.saveForm(true)}>Submit</Button>
                            </ButtonGroup>
                        </div>
                    }
                    
                </> : <></>}
            </Page>
        );
    }

    private updateRecordInDatabase(isSubmitted: boolean, toaster?: () => void) {
        const questionValues = this.state.questionValues;
        const questions: { [key : string]: string } = {};
        this.textFieldQuestions.forEach(q => {
            questions[q.id] = q.id in questionValues ? questionValues[q.id] : ""
        });

        axios.post(`/dashboard-api/update-application.json`, {
            cvFilename: this.state.uploadedFileName || "",
            cvUrl: this.state.uploadedFileURL || "",
            questionResponses: JSON.stringify(questions),
            country: this.state.countrySelection,
            isSubmitted: isSubmitted,
        }).then(res => {
            console.log(res);
            const status = res.status;
            if(status == 200) {
                const payload = res.data;
                if("success" in payload && payload["success"]) {
                    const record: IApplicationRecord = payload["payload"];
                    this.props.updateApplication(record);

                    if(toaster) { toaster(); }
                    else { toast.success("Application saved."); }
                    this.setState({ isSubmitted: isSubmitted, isSaving: false });
                    return;
                }
            }
            toast.error("An error occurred.");
            console.log(status, res.data);
            this.setState({ isSaving: false });
        });
    }

    private loadApplicationRecord() {
        axios.get(`/dashboard-api/application-record.json`).then(res => {
            const status = res.status;
            if(status == 200) {
                const obj = res.data;
                if ("success" in obj && obj["success"]) {
                    const record: IApplicationRecord = obj["record"] as IApplicationRecord;
                    if(record) {
                        this.setState({
                            uploadedFileName: record.cvFilename || "",
                            uploadedFileURL: record.cvFilename || "",
                            questionValues: JSON.parse(record.questionResponses) as { [key: string]: string },
                            countrySelection: record.country,
                            isSubmitted: record.isSubmitted,
                        });
                    }
                    return;
                }
            }
        });
    }
}

export default Apply;