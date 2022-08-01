class DateSection{

    constructor(){}

    getOnDate(strDate){
        const d = strDate ? new Date(strDate):new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const date = d.getDate();

        return `${year}-${month}-${year}`;
    }

    addDays(current_date,num_of_days){

        return new Date(current_date.getTime() + num_of_days*24*60*60*1000);
    }
    addDayToday(num_of_days){

        return new Date(new Date().getTime() + num_of_days*24*60*60*1000);
    }
    addMonth(current_date,num_of_months){

        current_date.setDate(current_date.getDate()+1);

        current_date.setMonth(current_date.getMonth() + parseInt(num_of_months));
        
        return current_date;
    }

    addYear(current_date,num_of_years){
        
        current_date.setDate(current_date.getDate()+1);
        current_date.setFullYear(current_date.getFullYear() + parseInt(num_of_years));
        return current_date;
    }
}
const dateSection = new DateSection();
module.exports = dateSection;