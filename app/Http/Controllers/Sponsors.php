<?php

namespace App\Http\Controllers;

use App\Models\Sponsor;
use App\Models\SponsorAgent;
use App\Models\SponsorDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\Sponsor as SponsorResource;

class Sponsors extends Controller
{
    public function dashboard()
    {
        return view('sponsors/dashboard');
    }

    public function api_get($path) {
        switch ($path) {
            case "init": return $this->initSession();
            // case 'get-sponsors': return $this->getSponsors();
            default: return $this->fail("Route not found");
        }

    }

    public function api_post(Request $request, $path) {
        $r = $request->request;
        switch ($path) {
            case 'store-asset': return $this->storeAsset($request, "pdf", 5000000);
            case 'add-sponsor': return $this->addSponsor($r);
            case 'delete-sponsor': return $this->deleteSponsor($r);
            case 'update-sponsor': return $this->sponsorAdminDetailsUpdate($r);
            case 'load-agents-access': return $this->loadSponsorAgents($r, "access");
            case 'load-agents-mentor': return $this->loadSponsorAgents($r, "mentor", ["sponsor", "admin"]);
            case 'load-agents-recruiter': return $this->loadSponsorAgents($r, "recruiter", ["sponsor", "admin"]);
            case 'add-agent-access': return $this->addSponsorAgent($r, "access");
            case 'add-agent-mentor': return $this->addSponsorAgent($r, "mentor", ["sponsor", "admin"]);
            case 'add-agent-recruiter': return $this->addSponsorAgent($r, "recruiter", ["sponsor", "admin"]);
            case 'remove-agent-access': return $this->removeSponsorAgent($r, "access");
            case 'remove-agent-mentor': return $this->removeSponsorAgent($r, "mentor", ["sponsor", "admin"]);
            case 'remove-agent-recruiter': return $this->removeSponsorAgent($r, "recruiter", ["sponsor", "admin"]);
            case 'add-resource': return $this->addResource($r);
            case 'load-resources': return $this->loadResources($r);
            case 'delete-resource': return $this->deleteResource($r);
            default: return $this->fail("Route not found");
        }
    }

    /**
     * Private Functions
     */

    private function response($success = true, $message = '') {
        return response()->json([
            'success' => $success,
            'message' => $message
        ]);
    }

    private function fail($message = '') {
        return $this->response(false, $message);
    }

    private function success($message = '') {
        return $this->response(true, $message);
    }

    // 4 roles: hacker, sponsor, committee, admin
    private function canContinue($allowed = [], $r, $stringChecks = []) {
        array_push($allowed, "committee", "admin"); // TODO "committee" temporary

        // Check the request provides all required arguments.
        array_push($stringChecks, "sponsor_id", "sponsor_slug");
        if(Auth::check() && in_array(Auth::user()->type, $allowed)) {
            if($r) {
                foreach ($stringChecks as $param) {
                    $val = $r->get($param);
                    if(!$val || strlen($val) == 0) return false;
                }
            } else if (!$r && len($stringChecks) > 0) {
              return false;
            }
        } else {
            // Not logged in or user type not allowed.
            return false;
        }

        $id = $r->get("sponsor_id");
        $slug = $r->get("sponsor_slug");
        $sponsor = Sponsor::where("id", $id)
            ->where("slug", $slug)
            ->first();

        if($sponsor) {
            if(in_array(Auth::user()->type, ["admin", "committee"])) return true;

            // Try to find agent record.
            $agent = $sponsor->agents()
                              ->where("type", "agent")
                              ->where("email", Auth::user()->email)
                              ->get();
            if($agent && Auth::user()->type == "sponsor") {
                return true;
            }
        }

        return false;
    }

    private function initSession() {
        if(Auth::check()) {
            $sponsors = array();
            if(in_array(Auth::user()->type, ["admin", "committee"])) {
                $sponsors = Sponsor::all();
            } else {
                $sponsors = Sponsor::whereIn('id', function($query){
                    $query->select('sponsor_id')
                        ->from(with(new SponsorAgent)->getTable())
                        ->where("email", Auth::user()->email);
                })->get();
            }

            return response()->json([
                "success" => true,
                "payload" => array(
                    "baseUrl" => route("sponsors_dashboard", array(), false),
                    "user" => array(
                        "type" => Auth::user()->type,
                        "name" => Auth::user()->name,
                    ),
                    "sponsors" => $sponsors
                ),
            ]);
        }
    }

    public function storeAsset(Request $r, $mimes, $maxSize) {
        $url = 'https://s3.' . env('AWS_DEFAULT_REGION') . '.amazonaws.com/' . env('AWS_BUCKET') . '/';
        if($this->canContinue(["admin", "sponsor"], $r->request, ["sponsor_slug"])) {
            $sponsor_slug = $r->request->get("sponsor_slug");
            if ($r->hasFile('asset')) {
                if ($r->file('asset')->isValid()){
                    $file = $r->file('asset');
                    $this->validate($r, [
                        'asset' => 'required|mimes:'.$mimes.'|max:'.$maxSize
                    ]);
                    if (strlen($file->getClientOriginalName()) > 0){
                      $name = time() . '-' . $this->slugify($file->getClientOriginalName());
                      $filePath = 'sponsors/' . $sponsor_slug . '/' . $name;
                      if (Storage::disk('s3')->put($filePath, file_get_contents($file))){
                        return $this->success($url . $filePath);
                      }else{
                        return $this->fail("Failed to upload.");
                      }
                    }else{
                      return $this->fail("Invalid name.");
                    }
                }else{
                    return $this->fail("Malformed file.");
                }
            }
            return $this->fail("No file.");
        } else {
            return $this->fail("Checks failed.");
        }
    }

    public function addAllowedEmail($email, $name){
      // TODO: Add Bearer/auth
      // ---> Maybe don't use cURL
      $ch = curl_init();

      curl_setopt($ch, CURLOPT_URL, 'https://hackcambridge.eu.auth0.com/api/v2/users');
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_POSTFIELDS, "{\"email\":\".$email.\",\"user_metadata\":{},\"blocked\":false,\"email_verified\":true,\"app_metadata\":{},\"name\":\"".$name."\",\"connection\":\"email\",\"verify_email\":false}");

      $headers = array();
      $headers[] = 'Content-Type: application/json';
      $headers[] = 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik5rSTVNVGcxTVRRMk5rVXdNVGd5UlRNM1FqUkZRVEF3TWpBNE9FVXhSakkyT1VaQ01EVXhNdyJ9.eyJpc3MiOiJodHRwczovL2hhY2tjYW1icmlkZ2UuZXUuYXV0aDAuY29tLyIsInN1YiI6IncyS1hta3QwV2NmRGZzbjJ4WlVBN0xTVm50cHY5TmRTQGNsaWVudHMiLCJhdWQiOiJodHRwczovL2hhY2tjYW1icmlkZ2UuZXUuYXV0aDAuY29tL2FwaS92Mi8iLCJpYXQiOjE1NzI1MzczNDksImV4cCI6MTU3MjYyMzc0OSwiYXpwIjoidzJLWG1rdDBXY2ZEZnNuMnhaVUE3TFNWbnRwdjlOZFMiLCJzY29wZSI6InJlYWQ6Y2xpZW50X2dyYW50cyBjcmVhdGU6Y2xpZW50X2dyYW50cyBkZWxldGU6Y2xpZW50X2dyYW50cyB1cGRhdGU6Y2xpZW50X2dyYW50cyByZWFkOnVzZXJzIHVwZGF0ZTp1c2VycyBkZWxldGU6dXNlcnMgY3JlYXRlOnVzZXJzIHJlYWQ6dXNlcnNfYXBwX21ldGFkYXRhIHVwZGF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgZGVsZXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.PaLGF0UqWerhlEPokgYpZpSbXOFBlZUIgVTtL7trbszVo-LMIhp0HKAMij5rd7JVkVURhQbwOLYc-Om1VI_kbLUkmZ6JFSZN-MY1i4AuFvQzeJi-iwWbc5rruSEA1fy8-2rPHOCjwFF5Cq7EFfwMHEBQIDyvutCsAx6wv3VUBL6HYCHTts_-tqgtEfzQhBEZV3IUD5bzaurc2nvzqMZPCmyEba3BL-puDW3VlcPab-dbONpCXWT0gFnuJqqgrPJ2f7ZyTt_OOENS8V7VTbiDCSu8i1poYt1JKfvKIOBHeXwcQY-BbZ2Kc6DdUGiLWiieqZTaSmeP_VZ2KK1Mv9sOnA';
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

      $result = curl_exec($ch);
      if (curl_errno($ch)) {
          echo 'Error:' . curl_error($ch);
      }
      curl_close($ch);
    }


    public function getUser($userid){
      // TODO: Finish this
      $ch = curl_init();

      // Use 'fields' param in request to specifically get user metadata
      curl_setopt($ch, CURLOPT_URL, 'https://login.auth0.com/api/v2/users/'.$userid);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $result = curl_exec($ch);
      if (curl_errno($ch)) {
          echo 'Error:' . curl_error($ch);
      }
      curl_close($ch);
    }

    public function deleteAsset(Request $r) {
        if($this->canContinue(["admin", "sponsor"], $r->request, ["sponsor_slug"])) {
          $index_aws = strpos($url,".amazonaws.com/");
          $length = strlen($url);
          $region = substr($url, 11, $index_aws - 11);
          $bucket = substr($url, $index_aws + 15, $length - $index_aws - 16);
          $filePath = subtr($url, $length - $index_aws - 15);

          if (($region != env('AWS_DEFAULT_REGION')) || ($bucket != env("AWS_BUCKET"))){
            // Here we would have to change the region or bucket of S3 to delete
            // ----> Probably a mistake
            return $this->fail("File path invalid.");
          }

          // Need to make sure the sponsor slug matches the path
          // We have:
          //  $filePath = 'sponsors/' . $sponsor_slug . '/' . $name;

          // So, explode on path: note this is unambigious since
          // we use slugify...
          $components = explode("/", $path);
          if ($components[0] != "sponsors"){
            return $this->fail("Invalid resource.");
          }

          if ($r->request->get("sponsor_slug") != $components[1]){
            // Not your resource...
            return $this->fail("Unable to find resource.");
          }
          if(Storage::disk('s3')->delete($filePath)) {
              return $this->success("File removed successfully.");
          } else {
              return $this->fail("Failed to remove file.");
          }
        }
    }

    private function addSponsor($r) {
        // TODO "committee" is temporary.
        if(Auth::check() && in_array(Auth::user()->type, ["admin", "committee"])) {
            $name = $r->get("name");
            $slug = $this->slugify($name);
            if (strlen($slug) > 0) {
                $check = Sponsor::where('slug', $slug)->first();
                if (!$check) {
                    $sponsor = new Sponsor();
                    $sponsor->setAttribute("slug", $slug);
                    $sponsor->setAttribute("name", $name);
                    // $sponsor->save();
                    if ($sponsor->save()) {
                        return SponsorResource::make($sponsor);
                    } else {
                        return $this->fail("Failed to save new sponsor object");
                    }
                } else {
                    return $this->fail("Sponsor already exists");
                }
            } else {
                return $this->fail("Sponsor title invalid");
            }
        } else {
            return $this->fail("Checks failed.");
        }
    }

    private function deleteSponsor($r) {
        if($this->canContinue(["admin"], $r, ["sponsor_id", "sponsor_slug"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $sponsor = Sponsor::where("id", $id)
                              ->where("slug", $slug)
                              ->first();

            if($sponsor) {
                if($sponsor->delete()) {
                    return $this->success("Sponsor deleted.");
                } else {
                    return $this->fail("Failed to delete sponsor");
                }
            } else {
                return $this->success("Sponsor not found.");
            }
        } else {
            $this->fail("Checks failed.");
        }
    }

    private function sponsorAdminDetailsUpdate($r) {
        if($this->canContinue(["admin"], $r, ["sponsor_slug"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $tier = $r->get("tier");
            $privileges = $r->get("privileges");

            $sponsor = Sponsor::where("id", $id)
                ->where("slug", $slug)
                ->first();
            if($sponsor) {
                if($tier) $sponsor->setAttribute("tier", $tier);
                if($privileges) $sponsor->setAttribute("privileges", $privileges);
                if($sponsor->save()) {
                    return $this->success("Details updated.");
                } else {
                    return $this->fail("Save failed");
                }
            } else {
                return $this->fail("Sponsor not found");
            }
        } else {
            return $this->fail("Checks failed.");
        }
    }

    private function loadSponsorAgents($r, $type, $allowed = ["admin"]) {
        if($this->canContinue($allowed, $r, ["sponsor_id", "sponsor_slug"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $sponsor = Sponsor::where("id", $id)
                              ->where("slug", $slug)
                              ->first();

            if($sponsor) {
                $agents = $sponsor->agents()->where("type", $type)->get();
                return response()->json([
                    "success" => true,
                    "agents" => $agents
                ]);
            } else {
                $this->fail("no sponsor found");
            }
        } else {
            $this->fail("Checks failed.");
        }
    }

    // type one of 'access', 'mentor', 'recruiter'
    private function addSponsorAgent($r, $type, $allowed = ["admin"]) {
        if($this->canContinue($allowed, $r, ["sponsor_id", "sponsor_slug", "email"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $email = $r->get("email");
            $name = $r->get("name");

            $sponsor = Sponsor::where("id", $id)
                              ->where("slug", $slug)
                              ->first();
            if($sponsor) {
                $agent = $sponsor->agents()
                                 ->where("email", $email)
                                 ->where("type", $type)
                                 ->first();
                if(!$agent) {
                    $new_agent = new SponsorAgent();
                    $new_agent->setAttribute("sponsor_id", $sponsor->id);
                    $new_agent->setAttribute("name", $name ? $name : "");
                    $new_agent->setAttribute("email", $email);
                    $new_agent->setAttribute("type", $type);

                    if($type == "access") {
                        $this->addAllowedEmail($email, $name);
                    }
                    if($new_agent->save()) {
                        return response()->json([
                            "success" => true,
                            "agent" => $new_agent
                        ]);
                    } else {
                        return $this->fail("failed to save");
                    }
                } else {
                    $agent->setAttribute("name", $name ? $name : "");
                    if($agent->save()) {
                        return response()->json([
                            "success" => true,
                            "agent" => $agent
                        ]);
                    } else {
                        return $this->fail("failed to save existing");
                    }
                }
            } else {
                return $this->fail("invalid sponsor");
            }
        } else {
            return $this->fail("Checks failed.");
        }
    }

    private function removeSponsorAgent($r, $type, $allowed = ["admin"]) {
        if($this->canContinue($allowed, $r, ["sponsor_id", "sponsor_slug", "email"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $email = $r->get("email");

            $sponsor = Sponsor::where("id", $id)
                ->where("slug", $slug)
                ->first();
            if ($sponsor) {
                $agent = $sponsor->agents()
                    ->where("email", $email)
                    ->where("type", $type)
                    ->first();
                if($agent) {
                    if($agent->delete()) {
                        return $this->success("Successfully delete agent");
                    } else {
                        return $this->fail("Failed to delete agent");
                    }
                } else {
                    return $this->success("Agent already doesn't exist");
                }
            } else {
                $this->fail("Sponsor not found");
            }
        } else {
            $this->fail("Checks failed.");
        }
    }

    private function addResource($r) {
        if($this->canContinue(["admin", "sponsor"], $r, ["sponsor_id", "sponsor_slug", "payload", "detail_id", "detail_type", "complete"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $payload = $r->get("payload");
            $complete = $r->get("complete");
            $detail_id = $r->get("detail_id");
            $detail_type = $r->get("detail_type");

            $sponsor = Sponsor::where("id", $id)
                              ->where("slug", $slug)
                              ->first();
            if ($sponsor) {
                $sponsor_detail = null;
                if($detail_id >= 0) {
                    $sponsor_detail = $sponsor->details()
                                              ->where("id", $detail_id)
                                              ->where("type", $detail_type)
                                              ->first();
                }

                if($sponsor_detail) {
                    $sponsor_detail->setAttribute("payload", $payload);
                    $sponsor_detail->setAttribute("complete", $complete);
                }
                else {
                    $sponsor_detail = new SponsorDetail();
                    $sponsor_detail->setAttribute("payload", $payload);
                    $sponsor_detail->setAttribute("complete", $complete);
                    $sponsor_detail->setAttribute("type", $detail_type);
                    $sponsor_detail->setAttribute("sponsor_id", $sponsor->id);
                }

                if ($sponsor_detail->save()) {
                    return response()->json([
                        "success" => true,
                        "detail" => array(
                            "id" => $sponsor_detail->id,
                            "payload" => $sponsor_detail->payload,
                            "complete" => $sponsor_detail->complete,
                        )
                    ]);
                } else {
                    return $this->fail("Failed to save SponsorDetail");
                }
            } else {
                $this->fail("Sponsor doesn't exist");
            }
        } else {
            $this->fail("Checks failed");
        }
    }

    private function loadResources($r) {
        if($this->canContinue(["admin", "committee", "sponsor"], $r, ["sponsor_id", "sponsor_slug"])) {
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $detail_type = $r->get("detail_type");
            $sponsor = Sponsor::where("id", $id)
                              ->where("slug", $slug)
                              ->first();

            if ($sponsor) {
                if($detail_type)
                    $details = $sponsor->details()->where("type", $detail_type)->get();
                else
                    $details = $sponsor->details()->get();

                if($details) {
                    return response()->json([
                        "success" => true,
                        "details" => $details
                    ]);
                } else {
                    $this->fail("No details found");
                }
            } else {
                return $this->fail("Sponsor not found");
            }
        } else {
            $this->fail("Checks failed");
        }
    }

    private function deleteResource($r) {
        if($this->canContinue(["admin", "sponsor"], $r, ["sponsor_id", "sponsor_slug", "detail_id", "detail_type"])) {
            $detail_id = $r->get("detail_id");
            $id = $r->get("sponsor_id");
            $slug = $r->get("sponsor_slug");
            $detail_type = $r->get("detail_type");

            $sponsor = Sponsor::where("id", $id)
                ->where("slug", $slug)
                ->first();

            if($sponsor) {
                $detail = $sponsor->details()
                                  ->where("id", $detail_id)
                                  ->where("type", $detail_type)
                                  ->first();
                if($detail) {

                    return response()->json([
                        "success" => $detail->delete(),
                        "message" => "Running delete"
                    ]);
                } else {
                    return $this->success("Detail not found");
                }
            } else {
                return $this->fail("Sponsor not found");
            }
        } else {
            return $this->fail("Checks failed.");
        }
    }

    private static function slugify($text) {
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return 'n-a';
        }

        return $text;
    }
}
