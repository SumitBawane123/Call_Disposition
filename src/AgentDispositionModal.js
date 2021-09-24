import React from 'react';
import * as Flex from '@twilio/flex-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export default class AgentDispositionModal extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.showForm = this.showForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDispositionChange = this.handleDispositionChange.bind(this);
    this.state = {
      open: false,
      disposition: 'option-1',
      Phone_no : ''
    };
  }

  componentDidMount() {
    window.addEventListener('agentDispositionModalOpen', (e) => {
      this.showForm();
    }, false)
  }

  showForm() {
    this.setState({ open: true });
  }

  cancelForm() {
    this.setState({ open: false });
    var event = new Event('agentDispositionCanceled');
    window.dispatchEvent(event);
  }

  submitForm() {
    this.setState({ open: false });
    var event = new CustomEvent('agentDispositionSuccessful', { detail: { disposition: this.state.disposition }});
    window.dispatchEvent(event);
    //alert("before http");
  
    console.log("props",this.props.Call_id);
    const body = { "call_id" : this.state.Phone_no,
                  "res" : this.state.disposition                     
    };

    // Set up the HTTP options for your request
    const options = {
      method: 'POST',
      body: new URLSearchParams(body),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    };

    // Make the network request using the Fetch API
    fetch('https://orchid-stork-9039.twil.io/tocheckdisposition', options)     
      .then(resp => resp.json())
      .then(data => console.log(data));
      console.log("-----------------after http");
  }

  handleDispositionChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange(event) {
    this.setState({Phone_no: event.target.value});
  }
  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.cancelForm}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Survey</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Does the customer is opting for survey?
            </DialogContentText>
            <Select
              value={this.state.disposition}
              onChange={this.handleDispositionChange}
              name="disposition"
              style={{
                'marginTop': '20px'
              }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>

            </Select>
          </DialogContent>
          <DialogTitle id="form-dialog-title">Phone_no</DialogTitle>
         
          < input type="text" value={this.state.Phone_no} onChange={this.handleChange}  style={{width:200,height:15,marginLeft:25,padding:5}}  />
           
          <DialogActions style={{
            margin: '0',
            padding: '8px 4px'
          }}>
            <Flex.Button onClick={this.cancelForm}>
              Cancel
            </Flex.Button>
            <Flex.Button onClick={this.submitForm}>
              Submit
            </Flex.Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}