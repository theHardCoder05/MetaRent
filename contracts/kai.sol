DATE STATES:
[0] = No Agreement
[1] = Pre Rental
[2] = Active Rental

Structs:

struct Escrow {
    int balance;
    bool depositPaid;
    bool basePaid;
    bool fuelPaid;
    bool mileagePaid;
    bool overduePaid;
}

struct Car {
    string carMake;
    string carModel;
    string carVIN;
    string carYear;
    string carColor;
    int start_miles;
    int end_miles;
}

struct Owner {
    address eth;
    string legalName;
    string email;
    bool approveRental;
    bool releaseCar;
    bool receiveCar;
}

struct Renter {
    address eth;
    string legalName;
    string email;
    bool approveRental;
    bool receiveCar;
    bool returnCar;
}

struct Agreement {
    uint startDate;
    uint endDate;
    uint limitDate;
    uint mileageLimit;
}

struct FeeStructure {
    uint baseFee;
    uint fuelFee;
    uint excessMileageFee;
    uint securityDeposit;
    uint overdueFee;

    string Currency;
    uint exchangeRate;
}

Contract Variables:

    int contractState

    bool rentalApproved = False
    bool rentalActive = False
    bool rentalComplete = False
    bool rentalOverdue = False
    bool rentalMissing = False

    bool carRelease = False
    bool carReturn = False

    int startDate = Agreement.startDate // timestamp start of first day
    int endDate = Agreement.endDate // timestamp end of last day
    int limitDate = Agreement.limitDate // timestamp end of limit day

Owner Functions (Only Owner can call)

    def cancelRental():
        if (contractState == 0) & (Escrow.balance > 0):
            Escrow.transfer(Renter, Escrow.balance)
        if (contractState == 1) & (Escrow.balance > (FeeStructure.securityDeposit * FeeStructure.ER)):
            if (CURRENT_TIMESTAMP > startDateClose):
                Escrow.transfer(Owner, FeeStructure.securityDeposit * FeeStructure.ER)
            Escrow.transfer(Renter, Escrow.balance)
        endContract()
    
    /* state 0 */
    def approveRental():
        Owner.approveRental = True
        checkApproval()

    /* state 1 */
    def releaseCar():
        Owner.releaseCar = True
        checkRelease()

    /* state 2 */
    def inputEndMileage(miles):
        Car.end_miles = miles
        Car.excess_miles = (Car.end_miles - Car.start_miles) > Agreement.mileageLimit ? (Car.end_miles - Car.start_miles) : 0

    def receiveCar():
        Owner.receiveCar = True
        checkReturn()

Renter Functions (Only Renter can call)

    def cancelRental():
        if (contractState == 0) & (Escrow.balance > 0):
            Escrow.transfer(Renter, Escrow.balance)
        if (contractState == 1) & (Escrow.balance > (FeeStructure.securityDeposit * FeeStructure.ER)) :
            Escrow.transfer(Owner, FeeStructure.securityDeposit * FeeStructure.ER)
            Escrow.transfer(Renter, Escrow.balance)  
        endContract()

    def payEscrow():
        transfer money to escrow account

    /* state 0 */
    def approveRental():
        Renter.approveRental = True
        checkApproval()

    def payDeposit():
        if Escrow.depositPaid = False:
            Renter.payEscrow(FeeStructure.securityDeposit * FeeStructure.ER)
            # if successful:
                Escrow.depositPaid = True
        checkApproval()

    /* state 1 */
    def payBase():
        if Escrow.basePaid = False:
            Renter.payEscrow(FeeStructure.baseFee * FeeStructure.ER)
            # if successful:
                Escrow.basePaid = True
        checkActive()

    def payFuel():
        if Escrow.fuelPaid = False:
            Renter.payEscrow(FeeStructure.fuelFee * FeeStructure.ER)
            # if successful:
                Escrow.fuelPaid = True
        checkActive()

    def receiveCar():
        Renter.receiveCar = True
        checkRelease()

    /* state 2 */
    def payMileage():
        if (Car.end_miles) & (Escrow.mileagePaid = False):
            Renter.payEscrow(FeeStructure.excessMileageFee * Car.excess_miles * FeeStructure.ER)
            # if successful:
                Escrow.mileagePaid = True
    def payOverdue():
        if Escrow.overduePaid = False:
            Renter.payEscrow(FeeStructure.overdueFee * FeeStructure.ER)
            # if successful:
                Escrow.overduePaid = True

    def returnCar():
        Renter.returnCar = True
        checkReturn()

Escrow Functions (only smart contract can execute)

    def transfer(recipient, amount):
        # transfer amount to recipient
        # make a check that only smart contract can call this function?
        
State Check Functions (only smart contract can execute):

    def burnContract():
        ### TODO ###

    /* state 0 */
    def checkApproval():
        if Renter.approveRental & Owner.approveRental & Escrow.depositPaid:
            rentalApprove = True
            contractState = 1

    /* state 1 */
    def checkRelease():
        if Owner.releaseCar & Renter.receiveCar:
            carRelease = True

    def checkActive():
        if (carRelease) & (Escrow.fuelPaid) & (Escrow.basePaid) & (CURRENT_TIMESTAMP > startDateOpen):
            rentalActive = True
            contractState = 2

    /* state 2 */
    def checkReturn():
        if Owner.receiveCar & renter.returnCar & Car.end_miles:
            carReturn = True

    def checkComplete():
        if (CURRENT_TIMESTAMP <= endDateClose):
            if (carReturn) & (Escrow.mileagePaid):
                rentalComplete = True
                Escrow.transfer(Renter, FeeStructure.securityDeposit * FeeStructure.ER)
                Escrow.transfer(Owner, (FeeStructure.baseFee + 
                                        FeeStructure.fuelFee +
                                       (FeeStructure.excessMileageFee * Car.excess_miles)) * FeeStructure.ER)
                Escrow.transfer(Renter, Escrow.balance)
                endContract()
    
        if (CURRENT_TIMESTAMP > endDateClose) & (CURRENT_TIMESTAMP <= limitDateClose):
            rentalOverdue = True;
            if (carReturn) & (Escrow.mileagePaid) & (Escrow.overduePaid):
                rentalComplete = True
                Escrow.transfer(Owner, (FeeStructure.securityDeposit + 
                                        FeeStructure.baseFee + 
                                        FeeStructure.fuelFee +
                                       (FeeStructure.excessMileageFee * Car.excess_miles)) * FeeStructure.ER)
                Escrow.transfer(Renter, Escrow.balance)
                endContract()

        if (CURRENT_TIMESTAMP > limitDateClose):
            # legal action lol contact police phone 911


/* =========== simplified roadmap ========== */

STATE [0]
    if rentalApprove:
        state goes from [0] => [1]
    if Owner/Renter.cancelRental():
        escrow handles
        contract ended

STATE [1]
    if rentalActive:
        state goes from [1] => [2]
    if Owner/Renter.cancelRental():
        escrow handles
        contract ended

STATE [2]
    if date < end_date & car returned & fees paid:
        escrow handles
        contract ended 
    
    if date < limit_date & car returned & fees paid & late fees paid:
        escrow handles
        contract ended

    if date > limit_date:
        legal action lol