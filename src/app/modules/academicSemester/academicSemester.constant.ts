import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
  TAcademicSemesterNameAndCodeMapper,
} from './academicSemester.interface'

export const AcademicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
]
export const AcademicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03']

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const academicSemesterNameAndCodeMapper: TAcademicSemesterNameAndCodeMapper =
  {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  }
