document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
  console.log("loading event listenr...");
  
  document.querySelectorAll('input').forEach(item => {
    item.addEventListener('blur', event => {
		calcTotals(event);
    })
  })

  calcTotals();

});

function calcTotals(event) {
    console.log("calc totals...");
	
   	let meetings_month = calc_meetings_month();
    document.querySelector('#meetings_per_month').value = meetings_month.toFixed(5);
	
	let monthly_closed = calc_monthly_closed(meetings_month);
    document.querySelector('#monthly_closed').value = monthly_closed.toFixed(5);
	
	let management_overhead = calc_management_overhead();
    document.querySelector('#management_overhead').value = to_currency(management_overhead.toFixed());
	
	let cost_per_sdr = calc_cost_per_sdr(management_overhead.toFixed());
    document.querySelector('#cost_per_sdr').value = to_currency(cost_per_sdr.toFixed());

	let avg_deal = Number(document.querySelector('#average_deal').value);
	
	let sdr_rev_per_month = (monthly_closed * avg_deal);
	
	let total_months = 12;
	
	let engaged_months = calc_engaged_months(total_months);
	
	let curr_year_rev = sdr_rev_per_month * engaged_months;
	let sec_year_rev = (sdr_rev_per_month * total_months) + curr_year_rev;
	let third_year_rev = (sdr_rev_per_month * total_months)+ sec_year_rev;
	
	document.querySelector('#revenue td.current-year').innerHTML = to_currency(curr_year_rev);
	document.querySelector('#revenue td.second-year').innerHTML = to_currency(sec_year_rev);
	document.querySelector('#revenue td.third-year').innerHTML = to_currency(third_year_rev);
	
	let curr_year_cost = cost_per_sdr;
	let sec_year_cost = cost_per_sdr * 2;
	let third_year_cost = cost_per_sdr * 3;

	
	document.querySelector('#cost td.current-year').innerHTML = to_currency(curr_year_cost);
	document.querySelector('#cost td.second-year').innerHTML = to_currency(sec_year_cost);
	document.querySelector('#cost td.third-year').innerHTML = to_currency(third_year_cost);
	
	
	document.querySelector('#sales-dev td.current-year').innerHTML = to_currency(curr_year_rev/curr_year_cost);
	document.querySelector('#sales-dev td.second-year').innerHTML = to_currency(sec_year_rev/sec_year_cost);
	document.querySelector('#sales-dev td.third-year').innerHTML = to_currency(third_year_rev/third_year_cost);
	
	document.querySelector('#revenue-costs td.current-year').innerHTML = to_currency(curr_year_cost/curr_year_rev);
	document.querySelector('#revenue-costs td.second-year').innerHTML = to_currency(sec_year_cost/sec_year_rev);
	document.querySelector('#revenue-costs td.third-year').innerHTML = to_currency(third_year_cost/third_year_rev);
	
}

function calc_engaged_months(total_months) {
	
    let ramp_sdr_prod = Number(document.querySelector('#ramp_sdr_productivity').value);
    let pipe_win_mons = Number(document.querySelector('#pipeline_to_win_months').value);
    let seq_held_mons = Number(document.querySelector('#sequenced_to_held_months').value);
	
	
	return total_months - (ramp_sdr_prod+pipe_win_mons+seq_held_mons);	
}

function calc_meetings_month() {
    let sdr_act = document.querySelector('#sdr_activities').value;
	let conv_perc = to_percent(document.querySelector('#conversion_rate').value);
	let booked_perc = to_percent(document.querySelector('#booked_to_held').value);
	let month_days = 21;
	
	 return (((sdr_act * conv_perc) * booked_perc) * month_days);
}

function calc_monthly_closed(meetings_month) {
	let held_pipe_perc = to_percent(document.querySelector('#held_to_pipeline').value);	
	let pipe_cw_perc = to_percent(document.querySelector('#pipeline_closed_won').value);	
	
	 return ((meetings_month * held_pipe_perc) * pipe_cw_perc);
}

function calc_management_overhead() {
    let sdr_man_oh = document.querySelector('#sdr_manager_cost').value;
	let sdr_man_dr = Number(document.querySelector('#sdr_manager_direct_reports').value);
	sdr_man_dr = sdr_man_dr || 1;
	
	return sdr_man_oh / sdr_man_dr;
}

function calc_cost_per_sdr(management_overhead) {
    let sal_comm = document.querySelector('#salary_commision').value;
	let t_data = document.querySelector('#tools_data').value;
	
	let emp_oh = to_percent(document.querySelector('#general_employee_overhead').value);	
		
	return (Number(sal_comm) + Number(t_data) + Number(management_overhead)) * (1 + emp_oh);
}

function to_percent(num) {
	if (num) {
		return 	(num / 100);
	} 
	
	return 0;

}

function to_currency(num) {
	const formatter = new Intl.NumberFormat('en-US', {
	  style: 'currency',
	  currency: 'USD',
	  minimumFractionDigits: 2
	});
	return formatter.format(num);
}


