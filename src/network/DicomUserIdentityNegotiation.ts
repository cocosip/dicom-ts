export enum DicomUserIdentityType {
  Username = 1,
  UsernameAndPasscode = 2,
  Kerberos = 3,
  Saml = 4,
  Jwt = 5,
}

export class DicomUserIdentityNegotiation {
  userIdentityType: DicomUserIdentityType | null = null;
  positiveResponseRequested = false;
  primaryField: string | null = null;
  secondaryField: string | null = null;
  serverResponse: string | null = null;

  validate(): void {
    if (this.userIdentityType === null) {
      throw new Error(
        "User identity type should be Username, UsernameAndPasscode, Kerberos, Saml or Jwt",
      );
    }

    if (
      this.userIdentityType !== DicomUserIdentityType.UsernameAndPasscode
      && this.secondaryField
      && this.secondaryField.trim().length > 0
    ) {
      throw new Error("Secondary field should only be set for UsernameAndPasscode");
    }
  }

  clone(): DicomUserIdentityNegotiation {
    const clone = new DicomUserIdentityNegotiation();
    clone.userIdentityType = this.userIdentityType;
    clone.positiveResponseRequested = this.positiveResponseRequested;
    clone.primaryField = this.primaryField;
    clone.secondaryField = this.secondaryField;
    clone.serverResponse = this.serverResponse;
    return clone;
  }
}
