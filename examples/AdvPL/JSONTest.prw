#include 'json.ch'

User Function RunTest
	//TestMinify()
	//TestParse()
	TestFile()
	TestStringify()
	//TestImpParse()

	Return

/**
 * BEGIN SECTION TEST
 */
Static Function TestMinify
  Local cJSON     := '{    "some":      true,      [ "big", 1 ] }'
  Local cMinified := JSON():New( cJSON )
  
  cMinified := cMinified:Minify()

  Console( cMinified == '{"some":true,["big",1]}' )
  Return

Static Function TestParse
  Local oParser := JSON():New( '{ "data": [ { "name": "Marcelo", "age": 19 } ] }' )
  Local oResult
  oParser := oParser:Parse()

  If oParser:IsJSON()
  	oResult := oParser:Object()
    Console( oResult[#'data'][ 1 ][#'name'] == "Marcelo" )
    Console( oResult[#'data'][ 1 ][#'age'] == 19 )
  Else
    Console( oParser:Error() )
  EndIf
  Return

Static Function TestFile()
  Local oParser := JSON():New( 'C:\hb30\bin\json\main.json' )
  oParser := oParser:File():Parse()

  If oParser:IsJSON()
    Console( oParser:Object()[#'children'][ 1 ][#'children'][ 1 ][#'description'] == 'Corretiva' )
  Else
    Console( oParser )
  EndIf
  Return

Static Function TestStringify()
  Local oJSON := JSONObject():New()
  
  oJSON[#'data'] := { JSONObject():New() }
  oJSON[#'data'][ 1 ][#'name'] := "Marcelo"
  oJSON[#'sub' ] := 12.4

  oJSON := JSON():New( oJSON )
  oJSON := oJSON:Stringify(.T.)

  Console( oJSON == '{"data":[{"name":"Marcelo"}],"sub":12.4}' )
  Return

Static Function TestImpParse()
  Local cJSON := '{"n": 1}'
  Local oJSON
  
  If ParseJSON( cJSON, @oJSON )
    Console( oJSON[#'n'] == 1 )
  Else
    Console( .F. )
  EndIf
  
  Return

