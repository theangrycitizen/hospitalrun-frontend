import Ember from 'ember';
import PatientDiagnosis from 'hospitalrun/mixins/patient-diagnosis';

const {
  computed,
  isEmpty
} = Ember;

export default Ember.Component.extend(PatientDiagnosis, {
  classNames: ['patient-summary'],
  canAddDiagnosis: false,
  disablePatientLink: false,
  diagnosisList: null,
  editProcedureAction: 'editProcedure',
  hideInActiveDiagnoses: true,
  patient: null,
  patientProcedures: null,
  showAddDiagnosisAction: 'showAddDiagnosis',
  showPatientAction: 'showPatient',
  visit: null,

  diagnosisContainer: computed('patient', 'visit', function() {
    // Pull diagnoses from visit if it is defined; otherwise pull from patient.
    let diagnosisContainer = this.get('visit');
    if (isEmpty(diagnosisContainer)) {
      diagnosisContainer = this.get('patient');
    }
    return diagnosisContainer;
  }),

  havePrimaryDiagnoses: computed('primaryDiagnoses.length', function() {
    let primaryDiagnosesLength = this.get('primaryDiagnoses.length');
    return (primaryDiagnosesLength > 0);
  }),

  haveProcedures: computed('patientProcedures.length', function() {
    let proceduresLength = this.get('patientProcedures.length');
    return (proceduresLength > 0);
  }),

  haveSecondaryDiagnoses: computed('secondaryDiagnoses.length', function() {
    let secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
    return (secondaryDiagnosesLength > 0);
  }),

  primaryDiagnoses: computed('patient.diagnoses.[]', 'visit.diagnoses.[]', 'diganosisContainer', function() {
    let diagnosisContainer = this.get('diagnosisContainer');
    let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
    return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, false);

  }),

  secondaryDiagnoses: computed('patient.diagnoses.[]', 'visit.diagnoses.[]', 'diganosisContainer', function() {
    let diagnosisContainer = this.get('diagnosisContainer');
    let hideInActiveDiagnoses = this.get('hideInActiveDiagnoses');
    return this.getDiagnoses(diagnosisContainer, hideInActiveDiagnoses, true);
  }),

  shouldLinkToPatient: computed('disablePatientLink', function() {
    let disablePatientLink = this.get('disablePatientLink');
    return !disablePatientLink;
  }),

  showPrimaryDiagnoses: computed('canAddDiagnosis', 'havePrimaryDiagnoses', function() {
    return this.get('canAddDiagnosis') || this.get('havePrimaryDiagnoses');
  }),

  actions: {
    linkToPatient() {
      let shouldLink = this.get('shouldLinkToPatient');
      if (shouldLink) {
        let patient = this.get('patient');
        let returnTo = this.get('returnTo');
        let returnToContext = this.get('returnToContext');
        patient.set('returnTo', returnTo);
        patient.set('returnToContext', returnToContext);
        this.sendAction('showPatientAction', this.get('patient'));
      }
    },
    editProcedure(procedure) {
      procedure.set('returnToVisit', false);
      procedure.set('returnToPatient', true);
      procedure.set('patient', this.get('patient'));
      this.sendAction('editProcedureAction', procedure);
    },

    showAddDiagnosis() {
      this.sendAction('showAddDiagnosisAction');
    }

  }
});
