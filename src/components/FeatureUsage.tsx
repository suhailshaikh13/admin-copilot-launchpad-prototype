import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.45px;
  color: #2f3130;
  margin: 0;
`

const Card = styled.div`
  background: white;
  border: 1px solid #dcdcda;
  border-radius: 16px;
  padding: 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  padding: 10px 12px;
  border-bottom: 1px solid #dcdcda;
  height: 40px;
  box-sizing: border-box;
`

const Td = styled.td`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #2f3130;
  padding: 6px 12px;
  border-bottom: 1px solid #eae9e8;
  height: 32px;
  box-sizing: border-box;
`

const NameLink = styled.a`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.154px;
  color: #406cc4;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #284173;
  }
`

const features = [
  { name: 'Macros', active: 53, runs: 0, unused: 55 },
  { name: 'Triggers', active: 23, runs: 424, unused: 13 },
  { name: 'Automations', active: 12, runs: 31, unused: 6 },
]

export default function FeatureUsage() {
  return (
    <Container>
      <SectionTitle>Feature usage</SectionTitle>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th />
              <Th>Active</Th>
              <Th>Runs (last 24 hours)</Th>
              <Th>Unused (last 30 days)</Th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.name}>
                <Td>
                  <NameLink href="#">{feature.name}</NameLink>
                </Td>
                <Td>{feature.active}</Td>
                <Td>{feature.runs}</Td>
                <Td>{feature.unused}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  )
}
