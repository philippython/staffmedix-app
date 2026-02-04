const SHIFT_TYPE_MAP = {
  "Night Shift": "night_shift",
  "Day  Shift": "day_shift",
  "Rotation Shift": "rotation_shift",
  "Flex Shift": "flex_shift",
};
const EMPLOYMENT_TYPE_MAP = {
  "Full time": "full_time",
  "Part time": "part_time",
  Contract: "contract",
  Internship: "internship",
  Temporary: "temporary",
};
const ORDERING_MAP = {
  "Salary: Low to High": "salary_min",
  "Salary: High to Low": "-salary_max",
  "Most Recent": "-created_at",
};

export default { SHIFT_TYPE_MAP, EMPLOYMENT_TYPE_MAP, ORDERING_MAP };
