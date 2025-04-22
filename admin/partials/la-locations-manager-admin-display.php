<div id="la-locations-crud-settings">
    <link rel="stylesheet" href="https://cdn.datatables.net/2.0.8/css/dataTables.dataTables.css" />
    <script src="https://cdn.datatables.net/2.0.8/js/dataTables.js"></script>
    <div id="resultModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
            <span class="close">&times;</span>
            <div>
                <pre id="result-container"></pre>
            </div>
        </div>
    </div>
    <div class="tab-heading">
        <h3>LMS Data</h3>
        <div class="float-right">
            <div id="diff-loader" class="loader hidden">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                    <radialGradient id='a11' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'>
                        <stop offset='0' stop-color='#F16BA2'></stop>
                        <stop offset='.3' stop-color='#F16BA2' stop-opacity='.9'></stop>
                        <stop offset='.6' stop-color='#F16BA2' stop-opacity='.6'></stop>
                        <stop offset='.8' stop-color='#F16BA2' stop-opacity='.3'></stop>
                        <stop offset='1' stop-color='#F16BA2' stop-opacity='0'></stop>
                    </radialGradient>
                    <circle transform-origin='center' fill='none' stroke='url(#a11)' stroke-width='15' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'>
                        <animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform>
                    </circle>
                    <circle transform-origin='center' fill='none' opacity='.2' stroke='#F16BA2' stroke-width='15' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                </svg>
            </div>
            <button id="generate-diff-button" class="action-button" onclick="generateDiff(event)">
                Generate LMS Diff
            </button>
        </div>
    </div>
    <div class="tab-body">
        <div id="diff-all-actions-wrapper" class="hidden">
            Change all actions to:
            <select onchange="changeAllActions(event)">
                <option value="update">Update</option>
                <option value="ignore">Ignore</option>
                <option value="noop">No action</option>
            </select>
        </div>
        <table id="locations-diff-table" class="display hover" style="width:100%">
            <thead>
                <tr>
                    <th scope="col">LMS ID</th>
                    <th scope="col" data-dt-order="disable">Diff</th>
                    <th scope="col" data-dt-order="disable">Action</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="button-footer">
            <button id="update-from-lms-button" class="hidden action-button" onclick="updateSelectedFromLms(event)">Update selected from LMS</button>
        </div>
    </div>
</div>
</div>