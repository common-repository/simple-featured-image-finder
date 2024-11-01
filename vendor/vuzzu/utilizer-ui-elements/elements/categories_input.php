<?php

/*************************************************
* Utilizer ui elements: categories select input
**************************************************/
function uz_categories_input($label,$input_name,$input_value,$use_keys=true) {

	$categories_raw = get_categories( array('type'=>'post') );
	foreach ($categories_raw as $cobj) {
		$categories_list[$cobj->cat_ID] = $cobj->name;
	}

	$options = $categories_list;

	uz_select_input($label,$input_name,$input_value,$options,$use_keys);

}
