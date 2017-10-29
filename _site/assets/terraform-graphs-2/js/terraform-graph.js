//
// terraform-graph.js: a pile of egregious hacks for
// terraform dependency graph visualizations...
//



//
// old version to demonstrate progress...
//
var svg_activate_old = function(selector, svg_url, json_url) {
	
    var container = d3.select(selector);
    //console.log(selector);
    //console.log(container);

    // **** d3.v4 version
    var categorical = [
{ "name" : "schemeAccent", "n": 8},
{ "name" : "schemeDark2", "n": 8},
{ "name" : "schemePastel2", "n": 8},
{ "name" : "schemeSet2", "n": 8},
{ "name" : "schemeSet1", "n": 9},
{ "name" : "schemePastel1", "n": 9},
{ "name" : "schemeCategory10", "n" : 10},
{ "name" : "schemeSet3", "n" : 12 },
{ "name" : "schemePaired", "n": 12},
{ "name" : "schemeCategory20", "n" : 20 },
{ "name" : "schemeCategory20b", "n" : 20},
{ "name" : "schemeCategory20c", "n" : 20 }		   ]

    var color_scale = d3.scaleOrdinal(d3[categorical[10].name]);

    // wrap color_scale for debugging purposes.
    var color = function(n) {
	var c = color_scale(n);
	//console.log(n + ' ' + c);
	return c;
    }

    // initialize 20-color palette. 
    for (var i = 1; i < 21; i++)
	color(i);


    // **** d3.v4 version
    d3.xml(svg_url, function(error, xml) {
	    container.node()
		.appendChild(document.importNode(xml.documentElement, true));

	    // remove <title>s in svg, graphviz leaves these here and they
	    // trigger useless tooltips.
	    d3.select(selector).selectAll('title').remove();


	    // Obtain the graph description.
	    d3.json(json_url, function(error, data) {
		    var links = data.links;
		    var x_nodes = data.nodes;
		    var svg_nodes = [];
		    var nodes = {};
		    data.nodes.forEach(function(node) {
			    nodes[node['id']] = node;
			    svg_nodes.push(node);
			});

		    // Compute the distinct nodes from the links.
		    links.forEach(function(link) {
			    link.source = nodes[link.source];
			    link.target = nodes[link.target];
			    link.value += 1;
			});
		
		    // Sometimes we have escaped newlines (\n) in
		    // json strings. we want <br> instead for display
		    var replacer = function(key, value) {
			if (typeof value == 'string') {
			    return value.replace(/\n/g, '<br>');
			}
			return value;
		    }

		    //var svg = d3.select(selector).select('svg');
		    var svg = container.select('svg');
		    // setup tooltips
		    var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				return "<span style='color:white'>" + d.simple_name + "</span>" + (d.def.length == 0 ? '' : "<p class='explain'>" + JSON.stringify(d.def, replacer, 2) + "</p>");
			    });

		    svg.call(tip);

		    //console.log(svg_nodes)
		    svg.selectAll('g.node')
			.data(svg_nodes, function(d) {
				return (d && d.svg_id) || d3.select(this).attr("id"); 
			    })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.on('mousedown', tip.show)
			.attr('fill', function(d) {return color(d.group); })
			.select('polygon')
			.style('fill', (function(d) { 
				    if (d)
					return color(d.group); 
				    else
					return '#000'; }));

		});

	});
		
};

//
// simple colors
//
var svg_activate_simple = function(selector, svg_url, json_url) {
	
    var container = d3.select(selector);
    //console.log(selector);
    //console.log(container);

    // **** d3.v4 version
    var categorical = [
{ "name" : "schemeAccent", "n": 8},
{ "name" : "schemeDark2", "n": 8},
{ "name" : "schemePastel2", "n": 8},
{ "name" : "schemeSet2", "n": 8},
{ "name" : "schemeSet1", "n": 9},
{ "name" : "schemePastel1", "n": 9},
{ "name" : "schemeCategory10", "n" : 10},
{ "name" : "schemeSet3", "n" : 12 },
{ "name" : "schemePaired", "n": 12},
{ "name" : "schemeCategory20", "n" : 20 },
{ "name" : "schemeCategory20b", "n" : 20},
{ "name" : "schemeCategory20c", "n" : 20 }		   ]

    var color_scale = d3.scaleOrdinal(d3[categorical[10].name]);

    // wrap color_scale for debugging purposes.
    var color = function(n) {
	var c = color_scale(n);
	//console.log(n + ' ' + c);
	return c;
    }

    var lookup = function(list, key, value) {
	for (var i in list)
	    if (i in list && key in list[i] && list[i][key] == value)
		return list[i];
    }

    // initialize 20-color palette. 
    for (var i = 1; i < 21; i++)
	color(i);

    // **** d3.v4 version
    d3.xml(svg_url, function(error, xml) {
	    container.node()
		.appendChild(document.importNode(xml.documentElement, true));
		
	    // remove <title>s in svg, graphviz leaves these here and they
	    // trigger useless tooltips.
	    d3.select(selector).selectAll('title').remove();


	    // Obtain the graph description.
	    d3.json(json_url, function(error, data) {
		    var links = data.links;
		    var x_nodes = data.nodes;
		    var svg_nodes = [];
		    var nodes = {};
		    data.nodes.forEach(function(node) {
			    nodes[node['id']] = node;
			    svg_nodes.push(node);
			});

		    // Sometimes we have escaped newlines (\n) in
		    // json strings. we want <br> instead for display
		    var replacer = function(key, value) {
			if (typeof value == 'string') {
			    return value.replace(/\n/g, '<br>');
			}
			return value;
		    }
		    
		    // returns <span> elements representing a node's direct children 
		    var child_html = function(d) {
			ret_str = '';
			//console.log(links);
			for (var src in data.links) {
			    //console.log(data.links[src]);
			    if (d.label == links[src].source) {
				var node = lookup(data.nodes, 'label', data.links[src].target);
				ret_str += '<span class="dep" style="background:' + color(node.group) + ';">' + node.simple_name + '</span><br>';
			    }

			}
			//console.log(ret_str);
			return ret_str;
		    }


		    //var svg = d3.select(selector).select('svg');
		    var svg = container.select('svg');
		    // setup tooltips
		    var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				return "<span style='background:" + color(d.group) + ";' class='header'>" + d.simple_name + "</span>" + (d.def.length == 0 ?  child_html(d) : "<p class='explain'>" + JSON.stringify(d.def, replacer, 2) + "</p><br>" + child_html(d) );
			    });

		    svg.call(tip);

		    //console.log(svg_nodes)
		    svg.selectAll('g.node')
			.data(svg_nodes, function(d) {
				return (d && d.svg_id) || d3.select(this).attr("id"); 
			    })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.on('mousedown', tip.show)
			.attr('fill', function(d) {return color(d.group); })
			.select('polygon')
			.style('fill', (function(d) { 
				    if (d)
					return color(d.group); 
				    else
					return '#000'; }));

		});

	});
		
};



var resource_groups = { 
'aws_api_gateway_account' : 1,
'aws_api_gateway_api_key' : 1,
'aws_api_gateway_authorizer' : 1,
'aws_api_gateway_base_path_mapping' : 1,
'aws_api_gateway_client_certificate' : 1,
'aws_api_gateway_deployment' : 1,
'aws_api_gateway_domain_name' : 1,
'aws_api_gateway_gateway_response' : 1,
'aws_api_gateway_integration' : 1,
'aws_api_gateway_integration_response' : 1,
'aws_api_gateway_method' : 1,
'aws_api_gateway_method_response' : 1,
'aws_api_gateway_method_settings' : 1,
'aws_api_gateway_model' : 1,
'aws_api_gateway_resource' : 1,
'aws_api_gateway_rest_api' : 1,
'aws_api_gateway_stage' : 1,
'aws_api_gateway_usage_plan' : 1,
'aws_api_gateway_usage_plan_key' : 1,
'aws_appautoscaling_policy' : 2,
'aws_appautoscaling_target' : 2,
'aws_batch_compute_environment' : 3,
'aws_batch_job_definition' : 3,
'aws_batch_job_queue' : 3,
'aws_cloudformation_stack' : 4,
'aws_cloudfront_distribution' : 5,
'aws_cloudfront_origin_access_identity' : 5,
'aws_cloudtrail' : 6,
'aws_cloudwatch_dashboard' : 7,
'aws_cloudwatch_event_rule' : 7,
'aws_cloudwatch_event_target' : 7,
'aws_cloudwatch_log_destination' : 7,
'aws_cloudwatch_log_destination_policy' : 7,
'aws_cloudwatch_log_group' : 7,
'aws_cloudwatch_log_metric_filter' : 7,
'aws_cloudwatch_log_stream' : 7,
'aws_cloudwatch_log_subscription_filter' : 7,
'aws_cloudwatch_metric_alarm' : 7,
'aws_codebuild_project' : 8,
'aws_codecommit_repository' : 9,
'aws_codecommit_trigger' : 9,
'aws_codedeploy_app' : 10,
'aws_codedeploy_deployment_config' : 10,
'aws_codedeploy_deployment_group' : 10,
'aws_codepipeline' : 11,
'aws_cognito_identity_pool' : 12,
'aws_config_config_rule' : 13,
'aws_config_configuration_recorder' : 13,
'aws_config_configuration_recorder_status' : 13,
'aws_config_delivery_channel' : 13,
'aws_dms_certificate' : 14,
'aws_dms_endpoint' : 14,
'aws_dms_replication_instance' : 14,
'aws_dms_replication_subnet_group' : 14,
'aws_dms_replication_task' : 14,
'aws_devicefarm_project' : 15,
'aws_directory_service_directory' : 16,
'aws_dynamodb_table' : 17,
'aws_alb' : 18,
'aws_alb_listener' : 18,
'aws_alb_listener_rule' : 18,
'aws_alb_target_group' : 18,
'aws_alb_target_group_attachment' : 18,
'aws_ami' : 18,
'aws_ami_copy' : 18,
'aws_ami_from_instance' : 18,
'aws_ami_launch_permission' : 18,
'aws_app_cookie_stickiness_policy' : 18,
'aws_autoscaling_attachment' : 18,
'aws_autoscaling_group' : 18,
'aws_autoscaling_lifecycle_hook' : 18,
'aws_autoscaling_notification' : 18,
'aws_autoscaling_policy' : 18,
'aws_autoscaling_schedule' : 18,
'aws_snapshot_create_volume_permission' : 18,
'aws_ebs_snapshot' : 18,
'aws_ebs_volume' : 18,
'aws_eip' : 18,
'aws_eip_association' : 18,
'aws_elb' : 18,
'aws_elb_attachment' : 18,
'aws_instance' : 18,
'aws_key_pair' : 18,
'aws_launch_configuration' : 18,
'aws_lb_cookie_stickiness_policy' : 18,
'aws_lb_ssl_negotiation_policy' : 18,
'aws_load_balancer_backend_server_policy' : 18,
'aws_load_balancer_listener_policy' : 18,
'aws_load_balancer_policy' : 18,
'aws_placement_group' : 18,
'aws_proxy_protocol_policy' : 18,
'aws_spot_datafeed_subscription' : 18,
'aws_spot_fleet_request' : 18,
'aws_spot_instance_request' : 18,
'aws_volume_attachment' : 18,
'aws_lb' : 19,
'aws_lb_listener' : 19,
'aws_lb_listener_rule' : 19,
'aws_lb_target_group' : 19,
'aws_lb_target_group_attachment' : 19,
'aws_ecr_repository' : 20,
'aws_ecr_repository_policy' : 20,
'aws_ecs_cluster' : 20,
'aws_ecs_service' : 20,
'aws_ecs_task_definition' : 20,
'aws_efs_file_system' : 21,
'aws_efs_mount_target' : 21,
'aws_elasticache_cluster' : 22,
'aws_elasticache_parameter_group' : 22,
'aws_elasticache_replication_group' : 22,
'aws_elasticache_security_group' : 22,
'aws_elasticache_subnet_group' : 22,
'aws_elastic_beanstalk_application' : 23,
'aws_elastic_beanstalk_application_version' : 23,
'aws_elastic_beanstalk_configuration_template' : 23,
'aws_elastic_beanstalk_environment' : 23,
'aws_emr_cluster' : 24,
'aws_emr_instance_group' : 24,
'aws_emr_security_configuration' : 24,
'aws_elasticsearch_domain' : 25,
'aws_elasticsearch_domain_policy' : 25,
'aws_elastictranscoder_pipeline' : 26,
'aws_elastictranscoder_preset' : 26,
'aws_glacier_vault' : 27,
'aws_iam_access_key' : 28,
'aws_iam_account_alias' : 28,
'aws_iam_account_password_policy' : 28,
'aws_iam_group' : 28,
'aws_iam_group_membership' : 28,
'aws_iam_group_policy' : 28,
'aws_iam_group_policy_attachment' : 28,
'aws_iam_instance_profile' : 28,
'aws_iam_openid_connect_provider' : 28,
'aws_iam_policy' : 28,
'aws_iam_policy_attachment' : 28,
'aws_iam_role' : 28,
'aws_iam_role_policy' : 28,
'aws_iam_role_policy_attachment' : 28,
'aws_iam_saml_provider' : 28,
'aws_iam_server_certificate' : 28,
'aws_iam_user' : 28,
'aws_iam_user_login_profile' : 28,
'aws_iam_user_policy' : 28,
'aws_iam_user_policy_attachment' : 28,
'aws_iam_user_ssh_key' : 28,
'aws_iot_certificate' : 29,
'aws_iot_policy' : 29,
'aws_inspector_assessment_target' : 30,
'aws_inspector_assessment_template' : 30,
'aws_inspector_resource_group' : 30,
'aws_kinesis_stream' : 31,
'aws_kinesis_firehose_delivery_stream' : 32,
'aws_kms_alias' : 33,
'aws_kms_key' : 33,
'aws_lambda_alias' : 34,
'aws_lambda_event_source_mapping' : 34,
'aws_lambda_function' : 34,
'aws_lambda_permission' : 34,
'aws_lightsail_domain' : 35,
'aws_lightsail_instance' : 35,
'aws_lightsail_key_pair' : 35,
'aws_lightsail_static_ip' : 35,
'aws_lightsail_static_ip_attachment' : 35,
'aws_opsworks_application' : 36,
'aws_opsworks_custom_layer' : 36,
'aws_opsworks_ganglia_layer' : 36,
'aws_opsworks_haproxy_layer' : 36,
'aws_opsworks_instance' : 36,
'aws_opsworks_java_app_layer' : 36,
'aws_opsworks_memcached_layer' : 36,
'aws_opsworks_mysql_layer' : 36,
'aws_opsworks_nodejs_app_layer' : 36,
'aws_opsworks_permission' : 36,
'aws_opsworks_php_app_layer' : 36,
'aws_opsworks_rails_app_layer' : 36,
'aws_opsworks_rds_db_instance' : 36,
'aws_opsworks_stack' : 36,
'aws_opsworks_static_web_layer' : 36,
'aws_opsworks_user_profile' : 36,
'aws_db_event_subscription' : 37,
'aws_db_instance' : 37,
'aws_db_option_group' : 37,
'aws_db_parameter_group' : 37,
'aws_db_security_group' : 37,
'aws_db_snapshot' : 37,
'aws_db_subnet_group' : 37,
'aws_rds_cluster' : 37,
'aws_rds_cluster_instance' : 37,
'aws_rds_cluster_parameter_group' : 37,
'aws_redshift_cluster' : 38,
'aws_redshift_parameter_group' : 38,
'aws_redshift_security_group' : 38,
'aws_redshift_subnet_group' : 38,
'aws_waf_byte_match_set' : 39,
'aws_waf_ipset' : 39,
'aws_waf_rule' : 39,
'aws_waf_rate_based_rule' : 39,
'aws_waf_size_constraint_set' : 39,
'aws_waf_sql_injection_match_set' : 39,
'aws_waf_web_acl' : 39,
'aws_waf_xss_match_set' : 39,
'aws_wafregional_byte_match_set' : 40,
'aws_wafregional_ipset' : 40,
'aws_route53_delegation_set' : 41,
'aws_route53_health_check' : 41,
'aws_route53_record' : 41,
'aws_route53_zone' : 41,
'aws_route53_zone_association' : 41,
'aws_s3_bucket' : 42,
'aws_s3_bucket_notification' : 42,
'aws_s3_bucket_object' : 42,
'aws_s3_bucket_policy' : 42,
'aws_ses_active_receipt_rule_set' : 43,
'aws_ses_domain_identity' : 43,
'aws_ses_receipt_filter' : 43,
'aws_ses_receipt_rule' : 43,
'aws_ses_receipt_rule_set' : 43,
'aws_ses_configuration_set' : 43,
'aws_ses_event_destination' : 43,
'aws_sfn_activity' : 44,
'aws_sfn_state_machine' : 44,
'aws_simpledb_domain' : 45,
'aws_sns_topic' : 46,
'aws_sns_topic_policy' : 46,
'aws_sns_topic_subscription' : 46,
'aws_ssm_activation' : 47,
'aws_ssm_association' : 47,
'aws_ssm_document' : 47,
'aws_ssm_maintenance_window' : 47,
'aws_ssm_maintenance_window_target' : 47,
'aws_ssm_maintenance_window_task' : 47,
'aws_ssm_patch_baseline' : 47,
'aws_ssm_patch_group' : 47,
'aws_ssm_parameter' : 47,
'aws_sqs_queue' : 48,
'aws_sqs_queue_policy' : 48,
'aws_customer_gateway' : 49,
'aws_default_network_acl' : 49,
'aws_default_route_table' : 49,
'aws_default_security_group' : 49,
'aws_default_subnet' : 49,
'aws_default_vpc' : 49,
'aws_default_vpc_dhcp_options' : 49,
'aws_egress_only_internet_gateway' : 49,
'aws_flow_log' : 49,
'aws_internet_gateway' : 49,
'aws_main_route_table_association' : 49,
'aws_nat_gateway' : 49,
'aws_network_acl' : 49,
'aws_network_acl_rule' : 49,
'aws_network_interface' : 49,
'aws_network_interface_attachment' : 49,
'aws_route' : 49,
'aws_route_table' : 49,
'aws_route_table_association' : 49,
'aws_security_group' : 49,
'aws_network_interface_sg_attachment' : 49,
'aws_security_group_rule' : 49,
'aws_subnet' : 49,
'aws_vpc' : 49,
'aws_vpc_dhcp_options' : 49,
'aws_vpc_dhcp_options_association' : 49,
'aws_vpc_endpoint' : 49,
'aws_vpc_endpoint_route_table_association' : 49,
'aws_vpc_peering_connection' : 49,
'aws_vpc_peering_connection_accepter' : 49,
'aws_vpn_connection' : 49,
'aws_vpn_connection_route' : 49,
'aws_vpn_gateway' : 49,
'aws_vpn_gateway_attachment' : 49,
'aws_vpn_gateway_route_propagation' : 49,

// bit of a hack.

''         : 50,
'provider' : 50,
'meta'     : 50,
'var'      : 51,
'output'   : 52

}



//
// with color.
//
    svg_activate_color = function(selector, svg_url, json_url) {
	
    var container = d3.select(selector);
    //console.log(selector);
    //console.log(container);
    
    // **** d3.v4 version
    var categorical = [
{ "name" : "schemeAccent", "n": 8},
{ "name" : "schemeDark2", "n": 8},
{ "name" : "schemePastel2", "n": 8},
{ "name" : "schemeSet2", "n": 8},
{ "name" : "schemeSet1", "n": 9},
{ "name" : "schemePastel1", "n": 9},
{ "name" : "schemeCategory10", "n" : 10},
{ "name" : "schemeSet3", "n" : 12 },
{ "name" : "schemePaired", "n": 12},
{ "name" : "schemeCategory20", "n" : 20 },
{ "name" : "schemeCategory20b", "n" : 20},
{ "name" : "schemeCategory20c", "n" : 20 } ]
	
    //var color_scale = d3.scaleOrdinal(d3[categorical[10].name]);
    var color_scale = d3.scaleOrdinal(d3['schemeCategory20']);

    // wrap color_scale for debugging purposes.
    var color = function(n) {
	var c = color_scale(n);
	return c;
    }

    var lookup = function(list, key, value) {
	for (var i in list)
	    if (i in list && key in list[i] && list[i][key] == value)
		return list[i];
    }

    // initialize 20-color palette. 
    //for (var i = 1; i < 21; i++)
    //	color(i);

    // **** d3.v4 version
    d3.xml(svg_url, function(error, xml) {
	    container.node()
		.appendChild(document.importNode(xml.documentElement, true));
		
	    // remove <title>s in svg, graphviz leaves these here and they
	    // trigger useless tooltips.
	    d3.select(selector).selectAll('title').remove();


	    // Obtain the graph description.
	    d3.json(json_url, function(error, data) {
		    var links = data.links;
		    var x_nodes = data.nodes;
		    var svg_nodes = [];
		    var nodes = {};
		    data.nodes.forEach(function(node) {
			    if ( !(node.type in resource_groups))
				console.log(node);
			    node.group = (node.type in resource_groups) ? resource_groups[node.type] : -1


			    nodes[node['id']] = node;
			    svg_nodes.push(node);
			});

		    // Sometimes we have escaped newlines (\n) in
		    // json strings. we want <br> instead for display
		    var replacer = function(key, value) {
			if (typeof value == 'string') {
			    return value.replace(/\n/g, '<br>');
			}
			return value;
		    }
		    
		    // returns <span> elements representing a node's direct children 
		    var child_html = function(d) {
			ret_str = '';
			//console.log(links);
			for (var src in data.links) {
			    //console.log(data.links[src]);
			    if (d.label == links[src].source) {
				var node = lookup(data.nodes, 'label', data.links[src].target);
				ret_str += '<span class="dep" style="background:' + color(node.group) + ';">' + node.simple_name + '</span><br>';
			    }

			}
			//console.log(ret_str);
			return ret_str;
		    }


		    //var svg = d3.select(selector).select('svg');
		    var svg = container.select('svg');
		    // setup tooltips
		    var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				return "<span style='background:" + color(d.group) + ";' class='header'>" + d.simple_name + "</span>" + (d.def.length == 0 ?  child_html(d) : "<p class='explain'>" + JSON.stringify(d.def, replacer, 2) + "</p><br>" + child_html(d) );
			    });

		    svg.call(tip);


		    //console.log(svg_nodes)
		    svg.selectAll('g.node')
			.data(svg_nodes, function(d) {
				return (d && d.svg_id) || d3.select(this).attr("id"); 
			    })
			.on('mouseover', tip.show)
			.on('mouseout', tip.hide)
			.on('mousedown', tip.show)
			.attr('fill', function(d) {return color(d.group); })
			.select('polygon')
			.style('fill', (function(d) { 
				    if (d)
					return color(d.group); 
				    else
					return '#000'; }));

		});


	});
		
};


//
// prospective version supporting animations.
//


svg_activate = function(selector, svg_url, json_url) {
	
    var container = d3.select(selector);
    //console.log(selector);
    //console.log(container);
    
    // **** d3.v4 version
    var categorical = [
{ "name" : "schemeAccent", "n": 8},
{ "name" : "schemeDark2", "n": 8},
{ "name" : "schemePastel2", "n": 8},
{ "name" : "schemeSet2", "n": 8},
{ "name" : "schemeSet1", "n": 9},
{ "name" : "schemePastel1", "n": 9},
{ "name" : "schemeCategory10", "n" : 10},
{ "name" : "schemeSet3", "n" : 12 },
{ "name" : "schemePaired", "n": 12},
{ "name" : "schemeCategory20", "n" : 20 },
{ "name" : "schemeCategory20b", "n" : 20},
{ "name" : "schemeCategory20c", "n" : 20 } ]
	
    //var color_scale = d3.scaleOrdinal(d3[categorical[10].name]);
    var color_scale = d3.scaleOrdinal(d3['schemeCategory20']);

   // wrap color_scale for debugging purposes.
    var color = function(n) {
	var c = color_scale(n);
	return c;
    }

    var lookup = function(list, key, value) {
	for (var i in list)
	    if (i in list && key in list[i] && list[i][key] == value)
		return list[i];
    }

    // initialize 20-color palette. 
    //for (var i = 1; i < 21; i++)
    //	color(i);

    // **** d3.v4 version
    d3.xml(svg_url, function(error, xml) {
	    container.node()
		.appendChild(document.importNode(xml.documentElement, true));
		
	    // remove <title>s in svg, graphviz leaves these here and they
	    // trigger useless tooltips.
	    d3.select(selector).selectAll('title').remove();


	    // Obtain the graph description.
	    d3.json(json_url, function(error, data) {
		    var links = data.links;
		    var x_nodes = data.nodes;
		    var svg_nodes = [];
		    var nodes = {};
		    data.nodes.forEach(function(node) {
			    if ( !(node.type in resource_groups))
				console.log(node);
			    node.group = (node.type in resource_groups) ? resource_groups[node.type] : -1;
			    nodes[node['label']] = node;
			    svg_nodes.push(node);
			});
		    //console.log(nodes);

		    
		    // this is grosssssssss.
		    var get_children = function(node) {
			
			var ret_children = [];

			for (var i in links) {
			    if (links[i].source == node.label) {
				ret_children.push(nodes[links[i].target]);
				if (links[i].target in nodes) {
				    var children = get_children(nodes[links[i].target]);
				    for (var j in children) {
					ret_children.push(children[j]);
				    }
				}
			    }
			}
			//console.log(ret_children);
			return ret_children;
		    }


		    // Sometimes we have escaped newlines (\n) in
		    // json strings. we want <br> instead for display
		    var replacer = function(key, value) {
			if (typeof value == 'string') {
			    return value.replace(/\n/g, '<br>');
			}
			return value;
		    }
		    
		    // returns <span> elements representing a node's direct children 
		    var child_html = function(d) {
			ret_str = '';
			//console.log(links);
			for (var src in data.links) {
			    //console.log(data.links[src]);
			    if (d.label == links[src].source) {
				var node = lookup(data.nodes, 'label', data.links[src].target);
				ret_str += '<span class="dep" style="background:' + color(node.group) + ';">' + node.simple_name + '</span><br>';
			    }

			}
			//console.log(ret_str);
			return ret_str;
		    }


		    //var svg = d3.select(selector).select('svg');
		    var svg = container.select('svg');
		    // setup tooltips
		    var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d) {
				return "<span style='background:" + color(d.group) + ";' class='header'>" + d.simple_name + "</span>" + (d.def.length == 0 ?  child_html(d) : "<p class='explain'>" + JSON.stringify(d.def, replacer, 2) + "</p><br>" + child_html(d) );
			    });

		    svg.call(tip);

		    var highlight = function(d) {
			tip.show(d);
			
			var children = get_children(d)
			children.push(d)

			svg.selectAll('g.node')
			.data(children, function(d) { return (d && d.svg_id) || d3.select(this).attr("id");  })
	    
			.attr('opacity', 1.0)
			.exit()
			.attr('opacity', 0.2)
		    }

		    var unhighlight = function(d) {
			svg.selectAll('g.node')
			.attr('opacity', 1.0);
			tip.hide(d);
		    }


		    //console.log(svg_nodes)
		    svg.selectAll('g.node')
			.data(svg_nodes, function(d) {
				return (d && d.svg_id) || d3.select(this).attr("id"); 
			    })
			.on('mouseover', highlight)
			.on('mouseout', unhighlight)
			.on('mousedown', highlight)
			.attr('fill', function(d) {return color(d.group); })
			.select('polygon')
			.style('fill', (function(d) { 
				    if (d)
					return color(d.group); 
				    else
					return '#000'; }));

		});


	});
		
};

