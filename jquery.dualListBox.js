/***************************************************************************************************************************
Title: JQuery Dual List Box Plugin
Author(s): Joshua Simacek
Create Date: 7/28/2016
Description: JQuery plugin creating 2 list boxes for updating a target collection from a source collection
Dependencies: JQuery.js, jquery.dualListBox.css
Version: 1.0.0
ChangeLog:
v1.0.1 - 1/19/2017 - (JS):
    • Added break tags after buttons
    • Changed appendTo to prependTo for showing modified options at the top of larger lists
v1.0.0 - 7/28/2016 - (JS):
    • Initial Implementation Complete
v0.0.1 - 7/26/2016 - (JS):
    • Begin Implementation
***************************************************************************************************************************/

(function ($) {

    var drag = false;
    var select = false;

    $.fn.dualListBox = function (options) {

        var opts = $.extend({}, $.fn.dualListBox.defaults, options);

        this.fill = function () {
            var sourceOptions = '';
            var targetOptions = '';

            $.each(opts.sourceData, function(key, val){
                sourceOptions += '<option value=' + val.Value + '>' + val.Text + '</option>';
            });
            this.find("#multiselect").append(sourceOptions);

            $.each(opts.targetData, function (key, val) {
                targetOptions += '<option current=' + val.IsCurrent + ' value=' + val.Value + '>' + val.Text + '</option>';
            });
            this.find('#dlbTarget').append(targetOptions);
        };//.fill()

        this.control = function () {
            var selectThis = this;

            $("#dlbAdd").on('click', function () {
                var p = selectThis.find("#dlbSource option:selected");

                var c = p.filter("[current=true]");
                var n = p.not("[current]");
                c.css("background","none");
                n.css("background","#ccffcc");
                c.clone().prependTo("#dlbTarget");
                n.clone().prependTo("#dlbTarget");
                c.remove();
                n.remove();
            });//dlbAdd.click()

            $("#dlbAddAll").on('click', function () {
                var p = selectThis.find("#dlbSource option");

                var c = p.filter("[current=true]");
                var n = p.not("[current]");
                c.css("background","none");
                n.css("background","#ccffcc");
                c.clone().prependTo("#dlbTarget");
                n.clone().prependTo("#dlbTarget");
                c.remove();
                n.remove();
            });//dlbAddAll.click()

            $("#dlbRemove").on('click', function () {
                var p = selectThis.find("#dlbTarget option:selected");

                var c = p.filter("[current=true]");
                var n = p.not("[current]")
                c.css("background", "#ffcccc");
                n.css("background", "none");
                c.clone().prependTo("#dlbSource");
                n.clone().prependTo("#dlbSource");
                c.remove();
                n.remove();
            });//dlbRemove.click()

            $("#dlbRemoveAll").on('click', function () {
                var p = selectThis.find("#dlbTarget option");

                var c = p.filter("[current=true]");
                var n = p.not("[current]")
                c.css("background", "#ffcccc");
                n.css("background", "none");
                c.clone().prependTo("#dlbSource");
                n.clone().prependTo("#dlbSource");
                c.remove();
                n.remove();
            });//dlbRemoveAll.click()

        };//.control

        this.getValues = function () {
            var objResult = [];
            this.find("#dlbTarget option").each(function () {
                objResult.push({
                    id: this.id,
                    text: this.text
                });
            });
            return objResult;
        };//.getValues()

        this.init = function () {
            var dualListBoxHtml =

              "<div class='row'>" +
              " <div class='col-sm-1'>&nbsp;</div>" +
              " <div class='col-sm-5'>" +
              "  <label class='dualListBoxLabel'>" + opts.sourceLabel + '</label>' +
              "  <select class='form-control dualListBox' id='dlbSource' multiple></select>" +
              " </div>" +
              " <div class='col-sm-1'>" +
              "  <div class='row'>&nbsp</div>" +
              "  <div class='dualListBoxButtonContainer'>" + 
              "   <div class='dualListBoxButtons'>" +
              "    <button id='dlbAdd' class='btn btn-default btn-sm'>" + opts.add + "</button><br/>" +
              "    <button id='dlbAddAll' class='btn btn-default btn-sm'>" + opts.addAll + "</button><br/>" +
              "    <button id='dlbRemoveAll' class='btn btn-default btn-sm'>" + opts.removeAll + "</button><br/>" +
              "    <button id='dlbRemove' class='btn btn-default btn-sm'>" + opts.remove + "</button>" +
              "   </div>" +
              "  </div>" +
              " </div>" +
              " <div class='col-sm-5'>" +
              "  <label class='dualListBoxLabel'>" + opts.targetLabel + '</label>' +
              "  <select class='form-control dualListBox' id='dlbTarget' multiple></select>" +
              " </div>" +
              "</div>";

            this.append(dualListBoxHtml);

            this.fill();
            this.control();
        };//.init()

        this.updateSource = function(data){
            var p = $(this).find("#dlbSource option");
            var n = p.not("[current]");
            n.remove();

            data.forEach(function (option) {
                //check if object exists in Source box, if so dont add it
                if(!$("#dlbTarget option[value='" + option.Value + "']").length > 0 && !$("#dlbSource option[value='" + option.Value + "'][current='true']").length > 0){

                    $("#dlbSource").append($("<option/>", {
                        value: option.Value,
                        text: option.Text
                    }));
                }//if()
            });//.forEach()
        }//updateSource()

        this.updateTarget = function(data){
            var p = $(this).find("#dlbTarget option");
            var n = p.not("[current]");
            n.remove();

            data.forEach(function (option) {
                //check if object exists in Target box, if so dont add it
                if(!$("#dlbSource option[value='" + option.Value + "']").length > 0 && !$("#dlbTarget option[value='" + option.Value + "'][current='true']").length > 0){

                    $("#dlbTarget").append($("<option/>", {
                        value: option.Value,
                        text: option.Text,
                        current: option.IsCurrent
                    }));
                }//if()
            });//.forEach()
        }//updateTarget()

        this.reset = function(){
            var s = $(this).find("#dlbSource option");
            var t = $(this).find("#dlbTarget option");

            var sc = s.filter("[current=true]");
            var tc = t.filter("[current=true]");
            var sn = s.not("[current]");
            var tn = t.not("[current]");

            sc.css("background", "none");
            tc.css("background", "none");
            sn.css("background", "none");
            tn.css("background", "none");

            s.remove();
            t.remove();
            sc.appendTo("#dlbTarget");
            tc.appendTo("#dlbTarget");
            sn.appendTo("#dlbSource");
            tn.appendTo("#dlbSource");

        }//reset()

        this.clear = function(){
            var s = $(this).find("#dlbSource option");
            var t = $(this).find("#dlbTarget option");

            s.remove();
            t.remove();
        }//clear()

        this.init();
        return this;
    };//.dualListBox()

    $.fn.dualListBox.defaults = {
        add: '&rsaquo;',
        addAll: '&raquo',
        remove: '&lsaquo;',
        removeAll: '&laquo'
    };

}(jQuery));